import {
  ADD_SONGS_TO_PLAYLIST,
  REMOVE_SONGS_FROM_PLAYLIST,
  ADD_PLAYLIST,
  REMOVE_PLAYLIST,
  RENAME_PLAYLIST
} from "./playlistsActionTypes";

const playlistsReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
};
export default playlistsReducer;
