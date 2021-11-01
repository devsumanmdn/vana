const PLAYER_SUFFIX = 'PLAYER';

export const PLAY = `${PLAYER_SUFFIX}/PLAY`;
export const PAUSE = `${PLAYER_SUFFIX}/PAUSE`;
export const LOAD_SONG = `${PLAYER_SUFFIX}/LOAD_SONG`;
export const SET_VOLUME = `${PLAYER_SUFFIX}/SET_VOLUME`;
export const SEEK = `${PLAYER_SUFFIX}/SEEK`;
export const TOGGLE_VISUALIZATION = `${PLAYER_SUFFIX}/TOGGLE_VISUALIZATION`;

export const pausePlayer = () => ({
  type: PAUSE,
});

export const playPlayer = () => ({
  type: PLAY,
});

export const loadSong = ({ songDataURL, play }) => ({
  type: LOAD_SONG,
  payload: { songDataURL, play },
});

export const setPlayerVolume = (volume) => ({
  type: SET_VOLUME,
  payload: volume,
});

export const seekPlayer = (duration) => ({
  type: SEEK,
  payload: duration,
});
