import { ipcMain, app, dialog, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";
import { parseFile, type IAudioMetadata } from "music-metadata";
import { IPC_CHANNELS } from "../shared/ipc-channels";
import type { MusicMetadataForUi } from "../shared/music-metadata";

const AUDIO_EXT = new Set(["mp3", "flac", "ogg", "webm"]);

const FALLBACK_ALBUM_ART =
  "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/compose_music_ovo2.svg";

function walkAudioFiles(dir: string, filelist: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walkAudioFiles(filepath, filelist);
    } else {
      const ext = file.split(".").pop()?.toLowerCase() ?? "";
      if (AUDIO_EXT.has(ext)) {
        filelist.push(filepath);
      }
    }
  }
  return filelist;
}

function buildMusicMetadata(location: string, parsedData: IAudioMetadata): MusicMetadataForUi {
  const picture = parsedData.common.picture?.[0];
  const albumArt = picture
    ? `data:image/jpeg;base64,${picture.data.toString("base64")}`
    : FALLBACK_ALBUM_ART;

  const commonSansPicture = { ...parsedData.common };
  delete (commonSansPicture as { picture?: unknown }).picture;
  let common = { ...commonSansPicture };
  if (!common.title) {
    common = { ...common, title: location.split(/[/\\]/).pop() };
  }
  if (!common.artists?.length) {
    common = { ...common, artists: ["Unknown"] };
  }

  const payload = {
    format: parsedData.format,
    common,
    quality: parsedData.quality,
    albumArt,
  };

  return JSON.parse(
    JSON.stringify(payload, (_key, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  ) as MusicMetadataForUi;
}

function registerHandler(
  channel: string,
  handler: (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => unknown
): void {
  ipcMain.removeHandler(channel);
  ipcMain.handle(channel, handler);
}

export function registerIpcHandlers(): void {
  registerHandler(IPC_CHANNELS.GET_FILE_PATH, (_e, fileName: string) =>
    path.join(app.getPath("userData"), `${fileName}.json`)
  );

  registerHandler(IPC_CHANNELS.PARSE_DATA_FILE, (_e, filePath: string, defaultData: unknown) => {
    try {
      return JSON.parse(fs.readFileSync(filePath as string, "utf-8"));
    } catch {
      return defaultData;
    }
  });

  registerHandler(IPC_CHANNELS.WRITE_FILE, (_e, filePath: string, data: string) => {
    fs.writeFileSync(filePath as string, data as string, "utf-8");
  });

  registerHandler(IPC_CHANNELS.GET_ARRAY_OF_FILES, (_e, dir: string) =>
    walkAudioFiles(dir as string, [])
  );

  registerHandler(IPC_CHANNELS.GET_MUSIC_METADATA, async (_e, location: string) =>
    buildMusicMetadata(location as string, await parseFile(location as string))
  );

  registerHandler(IPC_CHANNELS.OPEN_DIR_DIALOG, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return dialog.showOpenDialog(win ?? undefined, {
      properties: ["openDirectory"],
    });
  });

  registerHandler(
    IPC_CHANNELS.GET_DATA_URL,
    async (_e, location: string, codec: string) => {
      const buf = await fs.promises.readFile(location as string);
      return `data:audio/${(codec as string).toLowerCase()};base64,${buf.toString("base64")}`;
    }
  );
}
