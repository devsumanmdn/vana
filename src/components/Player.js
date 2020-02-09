import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import makeStyles from '@material-ui/styles/makeStyles';
import Slider from '@material-ui/core/Slider';
import PlayIcon from '@material-ui/icons/PlayArrowRounded';
import PlayNextIcon from '@material-ui/icons/SkipNextRounded';
import PlayPreviousIcon from '@material-ui/icons/SkipPreviousRounded';
import PauseIcon from '@material-ui/icons/PauseRounded';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeDown from '@material-ui/icons/VolumeDown';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import VolumeMute from '@material-ui/icons/VolumeMute';
import VolumeUp from '@material-ui/icons/VolumeUp';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
// import momentDurationFormatSetup from 'moment-duration-format';
import { connect } from 'react-redux';

import {
  playSong as playSongAction,
  pauseSong as pauseSongAction,
  resumeSong as resumeSongAction,
  playNextSong as playNextSongAction,
  playPrevSong as playPrevSongAction
  // setTotalDuration as setTotalDurationAction
} from '../redux/player/playerActions';
import parseFile from '../util/parseFile';
import { settingsPropType } from '../redux/settings/settingsReducer';

const fs = window.require('fs');

momentDurationFormatSetup(moment);

const useStyle = makeStyles({
  root: {
    width: '100%',
    maxWidth: '100%',
    maxHeight: 100,
    minHeight: 100,
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    transitionDuration: '1s',
    justifyContent: 'space-evenly',
    overflow: 'hidden',
    '-webkit-app-region': 'no-drag',

    '&.hidden': {
      minHeight: 0,
      height: 0
    },

    '&:not(.expandedView)': {
      background: '#fff1'
    },

    '&.expandedView': {
      height: '100%',
      width: '100%',
      padding: '10px 20px',
      top: 0,
      left: 0,
      maxHeight: 'unset',
      flexDirection: 'column',
      position: 'fixed',
      WebkitAppRegion: 'drag',

      '& > *': {
        WebkitAppRegion: 'no-drag'
      },
      '& $albumArt': {
        height: '90%',
        width: '90%',
        maxWidth: 'calc(100vh - 200px)',
        maxHeight: 'calc(100vh - 300px)',
        margin: '20px'
      },

      '& $volumeContainer': {
        // display: 'none'
      },

      '& $songInfo': {
        '& > p': {
          fontSize: '1.1em',
          margin: '0 10px'
        }
      },
      '& $playBtn': {
        height: '3.2em',
        width: '3.2em',
        marginRight: 20,
        padding: 10,
        '& > svg': {
          fontSize: '1.6em'
        }
      },
      '& $infoContainer': {
        flexGrow: 'unset',
        alignSelf: 'stretch'
      }
    }
  },
  backgroundContainer: ({ transparentMode }) => ({
    position: 'fixed',
    zIndex: -999999,
    ...(transparentMode
      ? {
          top: 30,
          left: 30,
          height: 'calc(100% - 60px)',
          width: 'calc(100% - 60px)'
        }
      : {
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backgroundColor: '#000'
        })
  }),
  background: {
    height: '100%',
    width: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    filter: ({ transparencyAmount }) =>
      `blur(1.20rem) brightness(0.5) opacity(${transparencyAmount / 100})`,
    transition: 'background-image 1.5s .5s',
    willChange: 'background-image',
    backgroundColor: '#0008',
    borderRadius: 6
  },
  albumArt: {
    height: 50,
    width: 50,
    minWidth: 50,
    marginRight: 20,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: 'transparent',
    transition: 'background-image 1s .3s',
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
    height: '2.2em',
    width: '2.2em',
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
      fontSize: '1.4em',
      transition: 'transform 0.3s'
    }
  },
  infoContainer: {
    flexGrow: 1,
    flexDirection: 'column',
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
      fontSize: '1.1em',
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
    display: 'flex',

    '& button': {
      background: 'transparent',
      minWidth: 30,
      margin: 0,
      marginRight: 10,
      '& svg': {
        width: 24
      }
    }
  },
  volumeSlider: {
    minHeight: 100
  },
  tooltip: {
    padding: '15px 5px 10px'
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
  playPrevSong,
  expandedView,
  setExpadedView,
  settings
}) => {
  const classes = useStyle(settings);
  const player = useRef(null);
  const [songInfo, setSongInfo] = useState(null);
  const [totalDuration, setTotalDuration] = useState();
  const [playedDuration, setPlayedDuration] = useState();

  const [volume, setVolume] = React.useState(30);

  useEffect(() => {
    if (activeSong && activeSong.location) {
      parseFile(activeSong.location).then(metaData => {
        document.title = metaData.common.title || 'Song';
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
      player.current.addEventListener('play', () => {
        playSong();
      });
      player.current.addEventListener('pause', () => {
        pauseSong();
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
  const getVolumeIcon = () => {
    if (volume) {
      if (volume < 0.3) {
        return <VolumeMute />;
      }

      if (volume < 0.7) {
        return <VolumeDown />;
      }

      return <VolumeUp />;
    }
    return <VolumeOff />;
  };

  return (
    <div className={clsx(classes.root, { expandedView, hidden: !activeSong })}>
      <div className={classes.backgroundContainer}>
        <div
          className={classes.background}
          style={{
            backgroundImage: `url(${albumArtDataURL}`
          }}
        />
      </div>
      {activeSong ? (
        <>
          {songInfo ? (
            <div
              role="presentation"
              onClick={() => setExpadedView(!expandedView)}
              className={classes.albumArt}
              style={{ backgroundImage: `url(${albumArtDataURL}` }}
              alt="albumArt"
            />
          ) : (
            <div
              role="presentation"
              onClick={() => setExpadedView(!expandedView)}
              className={classes.albumArt}
              style={{ background: '#000' }}
            />
          )}
          <div className={classes.songNavigation}>
            <button
              type="button"
              onClick={playPrevSong}
              className={classes.playBtn}
            >
              <PlayPreviousIcon />
            </button>
            <button
              type="button"
              onClick={handlePlayPause}
              className={clsx(classes.playBtn, 'playPause')}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
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
                  <div className={classes.separator} />
                  <p>{songInfo.common.artists}</p>
                </div>
              ) : null}
              <div className={classes.volumeContainer}>
                <Tooltip
                  interactive
                  classes={{ tooltip: classes.tooltip }}
                  title={
                    <Slider
                      classes={{ root: classes.volumeSlider }}
                      orientation="vertical"
                      value={volume * 100}
                      onChange={handleChange}
                      aria-labelledby="continuous-slider"
                    />
                  }
                >
                  <Button onClick={() => {}}>{getVolumeIcon()}</Button>
                </Tooltip>
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
                aria-labelledby="continuous-slider"
                onChange={handleSeek}
                onChangeCommitted={() => playSong()}
              />
              <span>
                {moment.duration(playedDuration, 'seconds').format('mm:ss', {
                  trim: false
                })}
              </span>
            </div>
          </div>
        </>
      ) : null}
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
  expandedView: PropTypes.bool.isRequired,
  setExpadedView: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired,
  playNextSong: PropTypes.func.isRequired,
  playPrevSong: PropTypes.func.isRequired,
  settings: settingsPropType.isRequired
};

Player.defaultProps = {
  activeSong: null
};

const mapStateToProps = ({ settings }) => ({ settings });

const mapDispatchToProps = {
  playSong: playSongAction,
  pauseSong: pauseSongAction,
  resumeSong: resumeSongAction,
  playNextSong: playNextSongAction,
  playPrevSong: playPrevSongAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
