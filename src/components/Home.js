import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/styles/makeStyles';
import { FixedSizeList as List, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import uuid from 'uuid';
import {
  Button as MUIButton,
  IconButton,
  Icon,
  Dialog
} from '@material-ui/core';
import * as mm from 'music-metadata';
import { connect } from 'react-redux';

import { remote } from 'electron';

import { addSongs as addSongsAction } from '../redux/songs/songsActions';
import {
  addSongsToQueue as addSongsToQueueAction,
  clearQueue as clearQueueAction
} from '../redux/player/playerActions';

import SongListItem from './SongListItem';
import Player from './Player';
import Sidebar from './Sidebar';
import SettingsDialog from './SettingsDialog';

import shuffle from '../util/shuffle';
import getArrayOfFiles from '../util/getArrayOfFiles';
import { toggleSettingsModal as toggleSettingsModalAction } from '../redux/settings/settingsActions';

const readFile = filePath => {
  return mm.parseFile(filePath).catch(err => {
    console.error(err.message);
  });
};

const Button = props => <MUIButton variant={'outlined'} {...props} />;

const useStyles = makeStyles({
  '@global': {
    body: {
      fontFamily: 'Sans Serif',
      margin: 0,
      padding: 0
    },
    '*::-webkit-scrollbar': {
      width: 8
    },
    '*::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)'
    },

    '*::-webkit-scrollbar-thumb': {
      backgroundColor: '#4444',
      outline: '1px solid slategrey',
      borderRadius: 4
    }
  },
  container: {
    display: 'flex',
    backgroundColor: '#0000',
    color: 'white',
    height: '100vh',
    overflow: 'hidden',
    borderRadius: 6
  },
  mainView: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  songsList: {
    flexGrow: 1,
    overflow: 'auto hidden'
  },
  buttonContainer: {
    margin: '0 5px',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: 'calc(100% - 70px)'
  },
  draggable: {
    WebkitAppRegion: 'drag',
    minWidth: 30,
    width: 40,
    cursor: 'grab',
    right: 10,
    top: 10,
    position: 'absolute',
    zIndex: 99999,
    color: '#FFF4',
    background: '#0000',
    border: '1px solid #FFF1'
  }
});

const Row = memo(({ data, index, style }) => {
  const metaData = data[index];
  return metaData ? (
    <SongListItem style={style} key={metaData.id} metaData={metaData} />
  ) : null;
}, areEqual);

const Home = ({
  songs,
  player,
  addSongs,
  addSongsToQueue,
  clearQueue,
  toggleSettingsModal
}) => {
  const [expandedView, setExpadedView] = useState(false);
  const { all: allSongs } = songs;
  const { activeSongId } = player;

  const classes = useStyles();

  const chooseFolderDialog = async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (!canceled) {
      const listOfSongPaths = await getArrayOfFiles(filePaths[0]);
      addSongs(listOfSongPaths.map(path => ({ location: path, id: uuid() })));
    }
  };

  const playAll = () => {
    clearQueue();
    const songIds = Object.values(allSongs).map(({ id }) => id);
    addSongsToQueue(songIds);
  };

  const shufflePlay = (e, songs = allSongs) => {
    clearQueue();
    const songIds = shuffle([...Object.values(songs).map(({ id }) => id)]);
    addSongsToQueue(songIds);
  };

  const activeSong = allSongs[activeSongId];

  return (
    <div className={classes.container}>
      {/*<Sidebar chooseFolderDialog={chooseFolderDialog} />*/}
      <div className={classes.mainView}>
        <div
          style={expandedView ? { visibility: 'hidden' } : {}}
          className={classes.buttonContainer}
        >
          <IconButton onClick={toggleSettingsModal}>
            <Icon>settings</Icon>
          </IconButton>
          <Button onClick={chooseFolderDialog}>
            <Icon>add</Icon>Add Songs
          </Button>
          <Button onClick={playAll}>
            <Icon>play_arrow</Icon>Play All
          </Button>
          <Button onClick={shufflePlay}>
            <Icon>shuffle</Icon>Shuffle ALL
          </Button>
        </div>
        <div
          style={expandedView ? { visibility: 'hidden' } : {}}
          className={classes.songsList}
        >
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={Object.keys(allSongs).length}
                itemData={Object.values(allSongs)}
                itemSize={80}
                width={width}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </div>
        <Player
          expandedView={expandedView}
          setExpadedView={setExpadedView}
          activeSong={activeSong}
          playerState={player}
        />
        <Button className={classes.draggable}>
          <Icon>drag_indicator</Icon>
        </Button>
      </div>
      <SettingsDialog />
    </div>
  );
};

Home.propTypes = {
  songs: PropTypes.shape({
    all: PropTypes.objectOf(PropTypes.shape({})).isRequired
  }).isRequired,
  player: PropTypes.shape({
    activeSongId: PropTypes.string,
    playing: PropTypes.bool
  }).isRequired,
  addSongs: PropTypes.func.isRequired,
  addSongsToQueue: PropTypes.func.isRequired,
  clearQueue: PropTypes.func.isRequired,
  toggleSettingsModal: PropTypes.func.isRequired
};

const mapStateToProps = ({ songs, player }) => ({
  songs,
  player
});

const mapDispatchToProps = {
  addSongs: addSongsAction,
  addSongsToQueue: addSongsToQueueAction,
  clearQueue: clearQueueAction,
  toggleSettingsModal: toggleSettingsModalAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
