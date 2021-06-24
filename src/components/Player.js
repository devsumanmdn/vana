import React, { useState, useEffect } from 'react';
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
import { Icon, List } from '@material-ui/core';
import VolumeUp from '@material-ui/icons/VolumeUp';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import AutoSizer from 'react-virtualized-auto-sizer';
// import momentDurationFormatSetup from 'moment-duration-format';
import { connect } from 'react-redux';

import {
  playSong as playSongAction,
  pauseSong as pauseSongAction,
  resumeSong as resumeSongAction,
  playNextSong as playNextSongAction,
  playPrevSong as playPrevSongAction,
  prepareSong as prepareSongAction,
  setShowQueue as setShowQueueAction,
  // setTotalDuration as setTotalDurationAction
} from '../redux/player/playerActions';
import {
  seekPlayer,
  setPlayerVolume as setPlayerVolumeAction,
} from '../redux/playerMiddleware/playerMiddleWareActions';
import parseFile from '../util/parseFile';
import { settingsPropType } from '../redux/settings/settingsReducer';
import PlayingQueueList from './PlayingQueueList';

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
    position: 'relative',

    '&.hidden': {
      minHeight: 0,
      height: 0,
    },

    '&:not(.expandedView)': {
      background: '#fff1',
      marginTop: 0,
      marginBottom: 0,
    },

    '&.expandedView': {
      height: '100%',
      width: '100%',
      padding: '10px 20px',
      top: 0,
      left: 0,
      maxHeight: 'unset',
      flexDirection: 'column',
      position: 'relative',

      '& $nowPlayingContainer': {
        height: '100%',
      },

      '& $albumArtContainer': {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        position: 'relative',
      },

      '& $albumArt': {
        height: '90%',
        width: '90%',
        maxWidth: 'calc(100vh - 200px)',
        maxHeight: 'calc(100vh - 300px)',
        margin: '20px',
      },

      '& $volumeContainer': {
        // display: 'none'
      },

      '& hideControls': {
        marginBottom: -50,
        opacity: 0,
        transitionDuration: '1s',
        justifyContent: 'space-evenly',
        overflow: 'hidden',
        position: 'relative',
      },

      '& $songInfo': {
        '& > p': {
          fontSize: '1.1em',
          margin: '0 10px',
        },
      },
      '& $playBtn': {
        height: '3.2em',
        width: '3.2em',
        marginRight: 20,
        padding: 0,
        '& > svg': {
          fontSize: '1.6em',
        },
      },
      '& $infoContainer': {
        flexGrow: 'unset',
        alignSelf: 'stretch',
      },

      '&.showingQueue': {
        '& $nowPlayingContainer': {
          height: '100%',
          display: 'flex',
        },

        '& $albumArtContainer': {
          width: '50%',
        },
      },
    },
  },

  nowPlayingContainer: {
    width: '100%',
    transitionDuration: '0.4s',
  },

  albumArtContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },

  backgroundContainer: ({ transparentMode }) => ({
    position: 'fixed',
    zIndex: -999999,
    ...(transparentMode
      ? {
          top: 30,
          left: 30,
          height: 'calc(100% - 60px)',
          width: 'calc(100% - 60px)',
        }
      : {
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backgroundColor: '#000',
        }),
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
    borderRadius: 6,
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
    cursor: 'nesw-resize',
  },
  songNavigation: {
    display: 'flex',
    margin: '20px 10px',
    transitionDuration: '0.3s',
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
      border: '1px solid #fff',
    },

    '&:hover': {
      '& > svg': {
        transform: 'scale(1.09)',
      },
    },

    '& > svg': {
      fontSize: '1.4em',
      transition: 'transform 0.3s',
    },
  },
  infoContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    overflow: 'hidden',
    marginTop: 10,
    transitionDuration: '0.3s',

    '&.hideControls': {
      marginButtom: -50,
      opacity: 0,
    },

    '& $songInfo, & > div': {
      display: 'flex',
      alignItems: 'center',
      '& > *': {
        whiteSpace: 'nowrap',
      },
    },
  },
  songInfo: {
    flexGrow: 1,
    minWidth: 0,
    '& > p': {
      fontSize: '1.1em',
      margin: '0 10px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  songPlaybackProgress: {
    '& > *': {
      margin: 10,
      alignItems: 'center',
    },
  },
  progressSlider: {},
  volumeContainer: {
    display: 'flex',

    '& button': {
      background: 'transparent',
      minWidth: 30,
      margin: 0,
      marginRight: 10,
      '& svg': {
        width: 24,
      },
    },
  },
  volumeSlider: {
    minHeight: 100,
  },
  tooltip: {
    padding: '15px 5px 10px',
  },
  separator: {
    height: 6,
    width: 6,
    minWidth: 6,
    borderRadius: '50%',
    backgroundColor: '#fff2',
    margin: '4px 8px',
  },
});

const Player = ({
  activeSong,
  playerState,
  pauseSong,
  playNextSong,
  playPrevSong,
  expandedView,
  setExpandedView,
  settings,
  seek,
  resumeSong,
  setPlayerVolume,
  prepareSong,
  setShowQueue,
  player,
}) => {
  const classes = useStyle(settings);
  const [songInfo, setSongInfo] = useState(null);
  const [controlsTimeout, setControlsTimeout] = useState(false);
  const { totalDuration, playedDuration, volume } = playerState;

  useEffect(() => {
    if (activeSong && activeSong.location) {
      parseFile(activeSong.location).then((metaData) => {
        document.title = metaData.common.title || 'Song';
        const codec = metaData && metaData.format && metaData.format.container;
        prepareSong({ location: activeSong.location, codec });
      });
    }
    if ('mediaSession' in navigator) {
      // navigator.mediaSession.setActionHandler('play', );
      // navigator.mediaSession.setActionHandler('pause', );
      navigator.mediaSession.setActionHandler('previoustrack', playPrevSong);
      navigator.mediaSession.setActionHandler('nexttrack', playNextSong);
    }
  }, []);

  useEffect(() => {
    if (activeSong && activeSong.location) {
      parseFile(activeSong.location).then((metaData) => {
        document.title = metaData.common.title || 'Song';
        setSongInfo(metaData);

        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: metaData.common.title,
            artist: metaData.common.artist,
            album: metaData.common.album,
            artwork: [
              {
                src: metaData.albumArt,
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          });
        }
      });
    }
  }, [activeSong]);

  useEffect(() => {
    let timeOut;

    const handler = () => {
      if (timeOut) {
        clearTimeout(timeOut);
      }

      timeOut = setTimeout(() => {
        setControlsTimeout(true);
      }, 3000);
      setControlsTimeout(false);
    };

    window.addEventListener('mousedown', handler);
    window.addEventListener('mousemove', handler);

    return () => {
      window.removeEventListener('mousedown', handler);
      window.removeEventListener('mousemove', handler);
      if (timeOut) {
        clearTimeout(timeOut);
      }
    };
  }, []);

  const handleVolumeChange = (event, newVolume) => {
    setPlayerVolume(newVolume / 100);
  };

  const handleSeek = (event, newValue) => {
    if (playerState.playing) {
      pauseSong();
    }
    const seekDur = totalDuration * (newValue / 100);
    seek(seekDur);
  };

  const handlePlayPause = () => {
    if (playerState.playing) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

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

  const handleExpandedViewToggle = () => {
    if (expandedView) {
      setShowQueue(false);
    }

    setExpandedView(!expandedView);
  };

  return (
    <div
      className={clsx(classes.root, {
        expandedView: expandedView || player.showQueue,
        showingQueue: player.showQueue,
        hidden: !activeSong,
        hideControls: controlsTimeout,
      })}
    >
      <canvas
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          zIndex: -1,
          opacity: 0.6,
        }}
        id="player-visualization"
      />
      <div className={classes.backgroundContainer}>
        <div
          className={classes.background}
          style={{
            backgroundImage: `url(${albumArtDataURL}`,
          }}
        />
      </div>
      {activeSong ? (
        <div className={classes.nowPlayingContainer}>
          <div className={classes.albumArtContainer}>
            {songInfo ? (
              <div
                role="presentation"
                onClick={handleExpandedViewToggle}
                className={classes.albumArt}
                style={{ backgroundImage: `url(${albumArtDataURL}` }}
                alt="albumArt"
              />
            ) : (
              <div
                role="presentation"
                onClick={handleExpandedViewToggle}
                className={classes.albumArt}
                style={{ background: '#000' }}
              />
            )}
            <div
              className={clsx(classes.songNavigation, {
                hideControls: controlsTimeout,
              })}
            >
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
            <div
              className={clsx(classes.infoContainer, {
                hideControls: controlsTimeout,
              })}
            >
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
                        onChange={handleVolumeChange}
                        aria-labelledby="continuous-slider"
                      />
                    }
                  >
                    <Button onClick={() => {}} aria-label="Volumne control">
                      {getVolumeIcon()}
                    </Button>
                  </Tooltip>
                  <Button
                    onClick={() => setShowQueue(!player.showQueue)}
                    aria-label="open playing queue"
                  >
                    <Icon>queue_music</Icon>
                  </Button>
                </div>
              </div>
              <div className={classes.songPlaybackProgress}>
                <span>
                  {moment.duration(playedDuration, 'seconds').format('mm:ss', {
                    trim: false,
                  })}
                </span>
                <Slider
                  classes={{ root: classes.progressSlider }}
                  value={(playedDuration / totalDuration) * 100}
                  aria-labelledby="continuous-slider"
                  onChange={handleSeek}
                  onChangeCommitted={() => resumeSong()}
                />
                <span>
                  {moment.duration(totalDuration, 'seconds').format('mm:ss', {
                    trim: false,
                  })}
                </span>
              </div>
            </div>
          </div>
          {player.showQueue ? <PlayingQueueList /> : null}
        </div>
      ) : null}
      <div
        style={
          expandedView || player.showQueue
            ? { visibility: 'hidden', maxHeight: 0 }
            : {}
        }
        className={classes.songsList}
      >
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={Object.keys([]).length}
              itemData={Object.values([])}
              itemSize={80}
              width={width}
            >
              {}
            </List>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

Player.propTypes = {
  playerState: PropTypes.shape({
    playing: PropTypes.bool,
    volume: PropTypes.number,
    isMute: PropTypes.bool,
    totalDuration: PropTypes.number,
    playedDuration: PropTypes.number,
  }).isRequired,
  activeSong: PropTypes.shape({
    codec: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
    albumArt: PropTypes.string,
  }),
  player: PropTypes.shape({
    showQueue: PropTypes.bool.isRequired,
  }).isRequired,
  expandedView: PropTypes.bool.isRequired,
  setExpandedView: PropTypes.func.isRequired,
  // playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired,
  resumeSong: PropTypes.func.isRequired,
  playNextSong: PropTypes.func.isRequired,
  playPrevSong: PropTypes.func.isRequired,
  seek: PropTypes.func.isRequired,
  setPlayerVolume: PropTypes.func.isRequired,
  prepareSong: PropTypes.func.isRequired,
  settings: settingsPropType.isRequired,
  setShowQueue: PropTypes.func.isRequired,
};

Player.defaultProps = {
  activeSong: null,
};

const mapStateToProps = ({ settings, player }) => ({ settings, player });

const mapDispatchToProps = {
  playSong: playSongAction,
  pauseSong: pauseSongAction,
  resumeSong: resumeSongAction,
  playNextSong: playNextSongAction,
  playPrevSong: playPrevSongAction,
  seek: seekPlayer,
  setPlayerVolume: setPlayerVolumeAction,
  prepareSong: prepareSongAction,
  setShowQueue: setShowQueueAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
