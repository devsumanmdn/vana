/** Shape returned from main over IPC for audio file metadata (JSON-safe). */
export interface MusicMetadataForUi {
  format: { container?: string };
  common: {
    title?: string;
    artists?: string[];
    artist?: string;
    album?: string;
    [key: string]: unknown;
  };
  quality?: unknown;
  albumArt: string;
}
