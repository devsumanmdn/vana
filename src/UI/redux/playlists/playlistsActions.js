import {
  ADD_SONGS_TO_PLAYLIST,
  REMOVE_SONGS_FROM_PLAYLIST,
  ADD_PLAYLIST,
  REMOVE_PLAYLIST,
  RENAME_PLAYLIST
} from "./playlistsActionTypes";

export function addSongsToPlaylist(songs) {
  return {
    type: ADD_SONGS_TO_PLAYLIST,
    payload: songs
  };
}

export function removeSongsFromPlaylist(songs) {
  return {
    type: REMOVE_SONGS_FROM_PLAYLIST,
    payload: songs
  };
}

export function addPlaylist({ name, songs = [] }) {
  return {
    type: ADD_PLAYLIST,
    payload: {
      name,
      songs
    }
  };
}

export function removePlaylist(playlistId) {
  return {
    type: REMOVE_PLAYLIST,
    payload: playlistId
  };
}

export function renamePlaylist({ playlistId, name }) {
  return {
    type: RENAME_PLAYLIST,
    payload: { playlistId, name }
  };
}
