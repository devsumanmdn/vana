/* eslint-disable no-nested-ternary */
import {
  ADD_SONGS_TO_QUEUE,
  REMOVE_SONGS_TO_QUEUE,
  PLAY_NEXT_SONG,
  PLAY_PREV_SONG,
  PLAY_SONG,
  RESUME_SONG,
  PAUSE_SONG
} from "./playerActionTypes";

const initialState = {
  queue: [],
  activeSongId: null,
  playing: false
};

const playerReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case ADD_SONGS_TO_QUEUE:
      return {
        ...state,
        queue: [...new Set([...state.queue, ...payload])],
        ...(!state.activeSongId && { activeSongId: payload[0] })
      };
    case REMOVE_SONGS_TO_QUEUE:
      return {
        ...state,
        queue: state.queue.filter(songId => !payload.includes(songId))
      };
    case PLAY_SONG:
      return {
        ...state,
        ...(!!payload && {
          queue: [...new Set([...state.queue, payload])],
          activeSongId: payload
        }),

        playing: true
      };
    case PLAY_NEXT_SONG: {
      if (state.queue.length === 0) {
        return state;
      }

      const presentActiveSongIndex = state.queue.findIndex(
        songId => songId === state.activeSongId
      );
      const nextSongIndex =
        presentActiveSongIndex !== -1 &&
        presentActiveSongIndex < state.queue.length - 1
          ? presentActiveSongIndex + 1
          : 0;
      const activeSongId = state.queue[nextSongIndex] || "";
      return {
        ...state,
        activeSongId,
        playing: true
      };
    }
    case PLAY_PREV_SONG: {
      if (state.queue.length === 0) {
        return state;
      }

      const presentActiveSongIndex = state.queue.findIndex(
        songId => songId === state.activeSongId
      );
      const prevSongIndex =
        presentActiveSongIndex !== -1 ? presentActiveSongIndex - 1 : 0;
      return {
        ...state,
        activeSongId:
          state.queue[
            prevSongIndex > -1 ? prevSongIndex : state.queue.length - 1
          ],
        playing: true
      };
    }
    case RESUME_SONG:
      return {
        ...state,
        playing: true
      };
    case PAUSE_SONG:
      return {
        ...state,
        playing: false
      };
    default:
      return state;
  }
};

export default playerReducer;
