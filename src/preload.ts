import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNELS } from "./shared/ipc-channels";
import type { MusicMetadataForUi } from "./shared/music-metadata";

contextBridge.exposeInMainWorld("electron", {
  getFilePath: (fileName: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_FILE_PATH, fileName) as Promise<string>,

  parseDataFile: (filePath: string, defaultData: unknown) =>
    ipcRenderer.invoke(
      IPC_CHANNELS.PARSE_DATA_FILE,
      filePath,
      defaultData
    ) as Promise<unknown>,

  writeFile: (filePath: string, data: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.WRITE_FILE, filePath, data) as Promise<void>,

  getArrayOfFiles: (dir: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_ARRAY_OF_FILES, dir) as Promise<string[]>,

  getMusicMetaData: (location: string) =>
    ipcRenderer.invoke(
      IPC_CHANNELS.GET_MUSIC_METADATA,
      location
    ) as Promise<MusicMetadataForUi>,

  openDirDialog: () =>
    ipcRenderer.invoke(IPC_CHANNELS.OPEN_DIR_DIALOG) as Promise<
      Electron.OpenDialogReturnValue
    >,

  getDataURL: (location: string, codec: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_DATA_URL, location, codec) as Promise<string>,
});
