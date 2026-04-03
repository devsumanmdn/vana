import { ipcMain, app, dialog, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";
import { parseFile, type IAudioMetadata } from "music-metadata";
import { IPC_CHANNELS } from "../shared/ipc-channels";
import type { MusicMetadataForUi } from "../shared/music-metadata";

const AUDIO_EXT = new Set(["mp3", "flac", "ogg", "webm"]);

/** Inline SVG so album art works under strict CSP (no https img-src required). */
const FALLBACK_ALBUM_ART =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6b7280"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>'
  );

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
    ? `data:image/jpeg;base64,${Buffer.from(picture.data).toString("base64")}`
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
