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
import {
  pausePlayer,
  playPlayer,
  loadSong,
  seekPlayer,
} from '../playerMiddleware/playerMiddleWareActions';
import parseFile from '../../util/parseFile';

const fs = window.require('fs');

export function clearQueue() {
  return {
    type: CLEAR_QUEUE,
  };
}

export function addSongsToQueue(songs) {
  return {
    type: ADD_SONGS_TO_QUEUE,
    payload: songs,
  };
}

export function removeSongsFromQueue(songs) {
  return {
    type: REMOVE_SONGS_FROM_QUEUE,
    payload: songs,
  };
}

export const setActiveSong = (songId) => ({
  type: SET_ACTIVE_SONG,
  payload: songId,
});

export const resumeSong = () => (dispatch) => {
  return dispatch(playPlayer());
};

export const prepareSong = ({ location, codec, play = false }) => (
  dispatch
) => {
  if (location && codec) {
    return fs.readFile(location, (err, data) => {
      try {
        if (err) throw err;

        const songDataURL = `data:audio/${codec.toLowerCase()};base64,${data.toString(
          'base64'
        )}`;
        if (songDataURL) {
          dispatch(loadSong({ songDataURL, play }));
        } else {
          throw Error('Unable to construct data URL');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    });
  }
  return Promise.resolve();
};

export const playSong = (songId, load = false) => async (
  dispatch,
  getState
) => {
  const state = getState();
  const {
    player: { queue = [] },
  } = getState();

  if (songId === state.player.activeSongId && !load) {
    return dispatch(resumeSong());
  }

  if (songId && !queue.find((queueSongId) => queueSongId === songId)) {
    dispatch(addSongsToQueue([songId]));
  }

  dispatch(setActiveSong(songId));

  const { location } = state.songs.all[songId] || {};
  const metaData = await parseFile(location);

  const codec = metaData && metaData.format && metaData.format.container;
  return dispatch(prepareSong({ location, codec, play: true }));
};

export const playNextSong = () => (dispatch, getState) => {
  const { player: playerState } = getState();
  if (playerState.queue.length === 0) {
    return;
  }

  const presentActiveSongIndex = playerState.queue.findIndex(
    (songId) => songId === playerState.activeSongId
  );

  const nextSongIndex =
    presentActiveSongIndex !== -1 &&
    presentActiveSongIndex < playerState.queue.length - 1
      ? presentActiveSongIndex + 1
      : 0;
  const nextSongId = playerState.queue[nextSongIndex] || '';

  if (presentActiveSongIndex === nextSongIndex) {
    dispatch(seekPlayer(0));
    dispatch(playPlayer());
  } else {
    dispatch(playSong(nextSongId));
  }
};

export const playPrevSong = () => (dispatch, getState) => {
  const { player: playerState } = getState();
  if (playerState.queue.length === 0) {
    return;
  }

  const presentActiveSongIndex = playerState.queue.findIndex(
    (songId) => songId === playerState.activeSongId
  );
  const prevSongIndex =
    presentActiveSongIndex !== -1 ? presentActiveSongIndex - 1 : 0;

  const prevSongId = playerState.queue[prevSongIndex] || '';

  if (presentActiveSongIndex === prevSongIndex) {
    dispatch(seekPlayer(0));
    dispatch(playPlayer());
  } else {
    dispatch(playSong(prevSongId));
  }
};

export const pauseSong = () => (dispatch) => {
  dispatch(pausePlayer());
};

export function setTotalDuration(totalDuration) {
  return {
    type: SET_TOTAL_DURATION,
    payload: totalDuration,
  };
}

export function setPlayedDuration(playedDuration) {
  return {
    type: SET_PLAYED_DURATION,
    payload: playedDuration,
  };
}

export const setVolume = (volume) => ({
  type: SET_VOLUME,
  payload: volume,
});

export const setPlaying = (isPlaying) => ({
  type: SET_PLAYING,
  payload: isPlaying,
});

export function toggleMute() {
  return {
    type: TOGGLE_MUTE,
  };
}
