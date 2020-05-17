/* eslint-disable no-nested-ternary */
import {
  ADD_SONGS_TO_QUEUE,
  CLEAR_QUEUE,
  REMOVE_SONGS_FROM_QUEUE,
  SET_TOTAL_DURATION,
  SET_PLAYED_DURATION,
  SET_VOLUME,
  TOGGLE_MUTE,
  SET_ACTIVE_SONG,
  SET_PLAYING,
} from './playerActionTypes';

const initialState = {
  queue: [],
  activeSongId: '',
  playing: false,
  totalDuration: 0,
  playedDuration: 0,
  volume: 80,
  isMute: false,
};

const playerReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case ADD_SONGS_TO_QUEUE:
      return {
        ...state,
        queue: [...new Set([...state.queue, ...payload])],
        ...(!state.activeSongId && { activeSongId: payload[0] }),
      };
    case CLEAR_QUEUE:
      return {
        ...state,
        activeSongId: '',
        queue: [],
      };
    case REMOVE_SONGS_FROM_QUEUE:
      return {
        ...state,
        queue: state.queue.filter((songId) => !payload.includes(songId)),
      };
    case SET_ACTIVE_SONG:
      return {
        ...state,
        activeSongId: payload,
      };
    case SET_PLAYING:
      return {
        ...state,
        playing: payload,
      };
    case SET_TOTAL_DURATION:
      return {
        ...state,
        totalDuration: payload,
      };
    case SET_PLAYED_DURATION:
      return {
        ...state,
        playedDuration: payload,
      };
    case SET_VOLUME:
      return {
        ...state,
        volume: payload,
      };
    case TOGGLE_MUTE:
      return {
        ...state,
        isMute: !state.isMute,
      };
    default:
      return state;
  }
};

export default playerReducer;
