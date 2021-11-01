import {
  ADD_SONGS,
  REMOVE_SONGS,
  ADD_SONGS_TO_SELECTION,
  REMOVE_SONGS_FROM_SELECTION
} from "./songsActionTypes";

export function addSongs(songs) {
  return {
    type: ADD_SONGS,
    payload: songs
  };
}

export function removeSongsFromPlaylist(songs) {
  return {
    type: REMOVE_SONGS,
    payload: songs
  };
}

export function addSongsToSelection(songs = []) {
  return {
    type: ADD_SONGS_TO_SELECTION,
    payload: songs
  };
}

export function removeSongsFromSelection(songs = []) {
  return {
    type: REMOVE_SONGS_FROM_SELECTION,
    payload: songs
  };
}
