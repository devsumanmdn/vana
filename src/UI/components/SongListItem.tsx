import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';

import { connect } from 'react-redux';

import {
  playSong as playSongAction,
  pauseSong as pauseSongAction,
} from '../redux/player/playerActions';


const useStyles = makeStyles({
  root: {
    borderTop: '1px solid #ddd2',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    color: 'lightgrey',
    cursor: 'default',
    '&:hover': {
      color: 'white',
    },
  },
  playBtn: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    borderRadius: '50%',
    height: 30,
    width: 30,
    minWidth: 30,
    marginRight: 10,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    cursor: 'pointer',
    '& > svg': {
      fontSize: 18,
    },
  },
  albumArt: {
    height: 40,
    width: 40,
    marginRight: 20,
  },
});

function SongListItem({ metaData, playing, playSong, pauseSong, ...rest }: any) {
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    (async () => {
      const info = await window.electron.getMusicMetaData(metaData.location).catch((e: Error) => {
        alert(e.message);
      });
      if (info) {
        setSongInfo(info);
      }
    })();
  }, [metaData.location]);

  const classes = useStyles();

  const albumArtDataURL = songInfo && songInfo.albumArt;

  const handlePlayPause = () => {
    if (playing) {
      pauseSong();
    } else {
      playSong(metaData.id);
    }
  };

  return songInfo ? (
    <div
      role="presentation"
      onClick={handlePlayPause}
      className={classes.root}
      {...rest}
    >
      <img className={classes.albumArt} src={albumArtDataURL} alt="albumArt" />
      <button type="button" className={classes.playBtn}>
        {playing ? <PauseRounded /> : <PlayArrowRounded />}
      </button>
      <p>{songInfo.common.title}</p>
      <audio src={metaData.location} />
    </div>
  ) : (
    <div className={classes.root} {...rest} />
  );
}

SongListItem.propTypes = {
  metaData: PropTypes.shape({
    location: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    albumArt: PropTypes.string,
  }).isRequired,
  playing: PropTypes.bool.isRequired,
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  playSong: playSongAction,
  pauseSong: pauseSongAction,
};

const mapStateToProps = ({ player }: { player: any }, ownProps: any) => ({
  playing: !!(ownProps.metaData.id === player.activeSongId && player.playing),
});

export default connect(mapStateToProps, mapDispatchToProps)(SongListItem);
