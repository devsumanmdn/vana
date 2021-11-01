/* eslint-disable consistent-return */
import {
  PLAY,
  PAUSE,
  LOAD_SONG,
  TOGGLE_VISUALIZATION,
  SET_VOLUME,
  SEEK,
} from './playerMiddleWareActions';
import {
  setTotalDuration,
  setPlayedDuration,
  setVolume,
  playNextSong,
  setPlaying,
} from '../player/playerActions';
import initiateAnalyser from '../../components/visualizer';

export default ({ dispatch }) => (next) => {
  const player = new Audio();

  player.addEventListener('loadeddata', () => {
    dispatch(setTotalDuration(player.duration));
  });
  player.addEventListener('timeupdate', () => {
    dispatch(setPlayedDuration(player.currentTime));
  });
  player.addEventListener('volumechange', () => {
    dispatch(setVolume(player.volume));
  });
  player.addEventListener('ended', () => {
    dispatch(playNextSong());
  });
  player.addEventListener('play', () => {
    dispatch(setPlaying(true));
  });

  player.addEventListener('pause', () => {
    dispatch(setPlaying(false));
  });

  setTimeout(() => {
    initiateAnalyser(player);
  }, 0);

  return (action) => {
    const { type, payload } = action;
    switch (type) {
      case PLAY:
        return player.play();
      case PAUSE:
        return player.pause();

      case LOAD_SONG:
        player.src = payload.songDataURL;
        if (payload.play) {
          player.play();
        }
        return;
      case SET_VOLUME:
        player.volume = payload;
        return;
      case SEEK:
        player.currentTime = payload;
        return;
      case TOGGLE_VISUALIZATION:
      default:
        return next(action);
    }
  };
};
