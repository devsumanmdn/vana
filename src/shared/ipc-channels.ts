/** IPC channel names shared between main and preload (must match exactly). */
export const IPC_CHANNELS = {
  GET_FILE_PATH: "vana:get-file-path",
  PARSE_DATA_FILE: "vana:parse-data-file",
  WRITE_FILE: "vana:write-file",
  GET_ARRAY_OF_FILES: "vana:get-array-of-files",
  GET_MUSIC_METADATA: "vana:get-music-metadata",
  OPEN_DIR_DIALOG: "vana:open-dir-dialog",
  GET_DATA_URL: "vana:get-data-url",
} as const;
