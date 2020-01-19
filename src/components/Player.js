import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import makeStyles from '@material-ui/styles/makeStyles';
import withStyles from '@material-ui/styles/withStyles';
import PlayIcon from '@material-ui/icons/PlayArrowRounded';
import PlayNextIcon from '@material-ui/icons/SkipNextRounded';
import PlayPreviousIcon from '@material-ui/icons/SkipPreviousRounded';
import PauseIcon from '@material-ui/icons/PauseRounded';
import MUISlider from '@material-ui/core/Slider';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeMute from '@material-ui/icons/VolumeMute';
import VolumeUp from '@material-ui/icons/VolumeUp';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { connect } from 'react-redux';

const fs = window.require('fs');

import {
  playSong as playSongAction,
  pauseSong as pauseSongAction,
  resumeSong as resumeSongAction,
  playNextSong as playNextSongAction,
  playPrevSong as playPrevSongAction
  // setTotalDuration as setTotalDurationAction
} from '../redux/player/playerActions';
import parseFile from '../util/parseFile';

const Slider = withStyles({
  root: {
    color: '#52af77',
    height: 4
  },
  thumb: {
    height: 15,
    width: 15,
    backgroundColor: '#fff',
    // border: "2px solid currentColor",
    transformOrigin: 'center',
    transform: 'translate(0, 0)',
    boxShadow: '0 0 4px 2px #fff6',
    '&:hover,&$active': {
      boxShadow: 'inherit',
      transform: 'scale(1.2)'
    }
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)'
  },
  track: {
    height: 4,
    borderRadius: 2
  },
  rail: {
    height: 4,
    borderRadius: 2
  }
})(MUISlider);

const useStyle = makeStyles({
  root: {
    width: '100vw',
    maxWidth: '100vw',
    maxHeight: 100,
    minHeight: 100,
    backgroundColor: '#2225',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    boxShadow: '-2px 0 10px 1px #0008',
    transitionDuration: '1s',
    justifyContent: 'space-evenly',
    overflow: 'hidden',
    '-webkit-app-region': 'no-drag',

    '&.expandedView': {
      height: '100vh',
      width: '100vw',
      padding: '10px 20px',
      top: 0,
      left: 0,
      maxHeight: 'unset',
      flexDirection: 'column',
      position: 'fixed',

      '& $albumArt': {
        height: '90vw',
        width: '90vw',
        maxWidth: 'calc(100vh - 200px)',
        maxHeight: 'calc(100vh - 300px)',
        margin: '20px'
      },

      '& $volumeContainer': {
        // display: 'none'
      },

      '& $songInfo': {
        marginTop: 10,
        '& > p': {
          fontSize: '18px',
          margin: '0 10px'
        }
      },
      '& $playBtn': {
        height: 50,
        width: 50,
        marginRight: 20,
        padding: 10,
        '& > svg': {
          fontSize: 28
        }
      },
      '& $infoContainer': {
        flexGrow: 'unset'
      }
    }
  },
  backgroundContainer: {
    position: 'fixed',
    zIndex: -9,
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    background: 'black'
  },
  background: {
    height: '100%',
    width: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(1.25rem) brightness(0.5)',
    transition: 'background-image 1s .3s',
    willChange: 'background-image'
  },
  albumArt: {
    height: 50,
    width: 50,
    minWidth: 50,
    backgroundColor: '#222',
    marginRight: 20,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: 'transparent',
    transition: 'background-image 0.6s .2s',
    willChange: 'background-image',
    cursor: 'nesw-resize'
  },
  songNavigation: {
    display: 'flex',
    margin: '20px 10px'
  },
  playBtn: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    height: 30,
    width: 30,
    marginRight: 10,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    cursor: 'pointer',

    '&.playPause': {
      border: '1px solid #fff'
    },

    '&:hover': {
      '& > svg': {
        transform: 'scale(1.09)'
      }
    },

    '& > svg': {
      fontSize: 18,
      transition: 'transform 0.3s'
    }
  },
  volumeContainer: {
    display: 'flex',
    '& > svg': {
      marginRight: 10
    }
  },
  infoContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    overflow: 'hidden',
    marginTop: 10,
    '& $songInfo, & > div': {
      display: 'flex',
      alignItems: 'center',
      '& > *': {
        whiteSpace: 'nowrap'
      }
    }
  },
  songInfo: {
    flexGrow: 1,
    minWidth: 0,
    '& > p': {
      fontSize: '18px',
      margin: '0 10px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }
  },
  songPlaybackProgress: {
    '& > *': {
      margin: 10,
      alignItems: 'center'
    }
  },
  progessSlider: {},
  volumeContainer: {
    marginRight: 20,
    '& > :not(last-child)': {
      marginRight: 5
    }
  },
  volumeSlider: {
    width: 100
  },
  separator: {
    height: 6,
    width: 6,
    minWidth: 6,
    borderRadius: '50%',
    backgroundColor: '#fff2',
    margin: '4px 8px'
  }
});

const Player = ({
  activeSong,
  playerState,
  playSong,
  pauseSong,
  playNextSong,
  playPrevSong
}) => {
  const classes = useStyle();
  const player = useRef(null);
  const [songInfo, setSongInfo] = useState(null);
  const [totalDuration, setTotalDuration] = useState();
  const [playedDuration, setPlayedDuration] = useState();
  const [expandedView, setExpadedView] = useState(false);
  const [volume, setVolume] = React.useState(30);

  useEffect(() => {
    if (activeSong && activeSong.location) {
      parseFile(activeSong.location).then(metaData => {
        setSongInfo(metaData);
      });
    }
  }, [activeSong]);

  const handleChange = (event, newVolume) => {
    if (player.current) {
      player.current.volume = newVolume / 100;
    }
  };

  const handleSeek = (event, newValue) => {
    if (player.current) {
      pauseSong();
      player.current.currentTime = totalDuration * (newValue / 100);
    }
  };

  useEffect(() => {
    if (player.current) {
      if (playerState.playing) {
        player.current.play();
      } else {
        player.current.pause();
      }
    }
  }, [playerState.playing]);

  const pause = () => {
    if (player.current) {
      player.current.pause();
    }
  };

  const play = () => {
    if (player.current !== null) {
      player.current.pause();
    }

    fs.readFile(activeSong.location, (err, data) => {
      const songDataURL =
        songInfo && songInfo.format
          ? `data:audio/${songInfo.format.codec.toLowerCase()};base64,${data.toString(
              'base64'
            )}`
          : null;
      player.current = new Audio(songDataURL);
      player.current.addEventListener('loadeddata', () => {
        setTotalDuration(player.current.duration);
      });
      player.current.addEventListener('timeupdate', () => {
        setPlayedDuration(player.current.currentTime);
      });
      player.current.addEventListener('volumechange', () => {
        setVolume(player.current.volume);
      });
      player.current.addEventListener('ended', () => {
        playNextSong();
      });
      player.current.play();
    });
  };

  const handlePlayPause = () => {
    if (playerState.playing) {
      pauseSong();
    } else {
      playSong();
    }
  };

  useEffect(() => {
    if (songInfo) {
      play();
    }
    return pause;
  }, [songInfo]);

  const { playing } = playerState;

  const albumArtDataURL = songInfo && songInfo.albumArt;

  return (
    <div className={clsx(classes.root, { expandedView })}>
      <div className={classes.backgroundContainer}>
        <div
          className={classes.background}
          style={{
            backgroundImage: `url(${albumArtDataURL}`
          }}
        ></div>
      </div>
      {songInfo ? (
        <div
          role={'presentation'}
          onClick={() => setExpadedView(!expandedView)}
          className={classes.albumArt}
          style={{ backgroundImage: `url(${albumArtDataURL}` }}
          alt={'albumArt'}
        />
      ) : (
        <div
          onClick={() => setExpadedView(!expandedView)}
          className={classes.albumArt}
          style={{ background: '#000' }}
        />
      )}
      <div className={classes.songNavigation}>
        <button
          type={'button'}
          onClick={playPrevSong}
          className={classes.playBtn}
        >
          <PlayPreviousIcon />
        </button>
        <button
          type={'button'}
          onClick={handlePlayPause}
          className={clsx(classes.playBtn, 'playPause')}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type={'button'}
          onClick={playNextSong}
          className={classes.playBtn}
        >
          <PlayNextIcon />
        </button>
      </div>
      <div className={classes.infoContainer}>
        <div>
          {songInfo ? (
            <div className={classes.songInfo}>
              <p>{songInfo.common.title}</p>
              <div className={classes.separator}></div>
              <p>{songInfo.common.artists}</p>
            </div>
          ) : null}
          <div className={classes.volumeContainer}>
            <VolumeUp />
            <Slider
              classes={{ root: classes.volumeSlider }}
              value={volume * 100}
              onChange={handleChange}
              aria-labelledby={'continuous-slider'}
            />
          </div>
        </div>
        <div className={classes.songPlaybackProgress}>
          <span>
            {moment.duration(totalDuration, 'seconds').format('mm:ss', {
              trim: false
            })}
          </span>
          <Slider
            classes={{ root: classes.progessSlider }}
            value={(playedDuration / totalDuration) * 100}
            aria-labelledby={'continuous-slider'}
            onChange={handleSeek}
            onChangeCommitted={playSong}
          />
          <span>
            {moment.duration(playedDuration, 'seconds').format('mm:ss', {
              trim: false
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

Player.propTypes = {
  playerState: PropTypes.shape({
    playing: PropTypes.bool
  }).isRequired,
  activeSong: PropTypes.shape({
    codec: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
    albumArt: PropTypes.string
  }),
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired,
  playNextSong: PropTypes.func.isRequired,
  playPrevSong: PropTypes.func.isRequired
};

Player.defaultProps = {
  activeSong: null
};

const mapDispatchToProps = {
  playSong: playSongAction,
  pauseSong: pauseSongAction,
  resumeSong: resumeSongAction,
  playNextSong: playNextSongAction,
  playPrevSong: playPrevSongAction
};

export default connect(null, mapDispatchToProps)(Player);
