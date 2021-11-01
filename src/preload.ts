import { contextBridge } from "electron";
import { dialog, BrowserWindow, app } from "@electron/remote";
import path from "path";
import fs from "fs";
import { IAudioMetadata, parseFile } from "music-metadata";

export interface ExtendedIAudioMetadata extends IAudioMetadata {
  albumArt: string;
}

contextBridge.exposeInMainWorld("electron", {
  getFilePath: (fileName: string) => {
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, `${fileName}.json`);
  },
  parseDataFile: (filePath: string, defaultData) => {
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (error) {
      // if there was some kind of error, return the passed in defaultData instead.
      return defaultData;
    }
  },
  writeFile: (filePath: string, data: string) =>
    fs.writeFileSync(filePath, data),
  readFile: (filePath: string, data) => fs.readFile(filePath, data),
  getArrayOfFiles: (dir: string, filelist: string[] = []) => {
    const walk = async (dir: string, filelist = []) => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);

        if (stat.isDirectory()) {
          filelist = await walk(filepath, filelist);
        } else if (
          ["mp3", "flac", "ogg", "webm"].includes(file.split(".").slice(-1)[0])
        ) {
          filelist.push(filepath);
        }
      }

      return filelist;
    };

    return walk(dir, filelist);
  },
  getMusicMetaData: (location: string): Promise<ExtendedIAudioMetadata> =>
    parseFile(location).then((parsedData) => {
      const albumArt = parsedData.common.picture?.[0]
        ? `data:image/jpeg;base64,${parsedData?.common?.picture?.[0]?.data.toString(
            "base64"
          )}`
        : `https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/compose_music_ovo2.svg`;

      const info: ExtendedIAudioMetadata = { ...parsedData, albumArt };
      if (!(info.common && info.common.title)) {
        const filename = location?.split("/").slice(-1)?.[0];
        info.common.title = filename;
      }
      if (!info.common.artists?.length) {
        info.common.artists?.push("Unknown");
      }

      return info;
    }),

  openDirDialog: async () =>
    dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
      properties: ["openDirectory"],
    }),
  getDataURL: async (location: string, codec: string): Promise<string> =>
    new Promise((res, rej) => {
      return fs.readFile(location, (err, data) => {
        if (err) {
          rej(err);
        }
        const dataUrl = `data:audio/${codec.toLowerCase()};base64,${data.toString(
          "base64"
        )}`;

        res(dataUrl);
      });
    }),
});
