import {
  ADD_SONGS,
  REMOVE_SONGS,
  ADD_SONGS_TO_SELECTION,
  REMOVE_SONGS_FROM_SELECTION
} from "./songsActionTypes";

const initialState = {
  all: {},
  selection: null
};

export default function counter(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case ADD_SONGS:
      return {
        ...state,
        all: {
          ...state.all,
          ...payload.reduce((acc, song) => ({ ...acc, [song.id]: song }), {})
        }
      };
    case REMOVE_SONGS:
      const newAllSongs = { ...state.all };
      const allSongs = payload.forEach(key => {
        delete newAllSongs[key];
      });
      return {
        ...state,
        all: newAllSongs
      };
    case ADD_SONGS_TO_SELECTION:
      return {
        ...state,
        selection: [payload]
      };
    case REMOVE_SONGS_FROM_SELECTION:
      return {
        ...state,
        selection: [payload]
      };
    default:
      return state;
  }
}
