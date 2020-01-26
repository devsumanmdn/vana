import React, { useState, memo, createRef } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/styles/makeStyles';
import { FixedSizeList as List, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import uuid from 'uuid';
import { Button as MUIButton, Icon } from '@material-ui/core';
import { connect } from 'react-redux';

import { remote } from 'electron';

import { addSongs as addSongsAction } from '../redux/songs/songsActions';
import {
  addSongsToQueue as addSongsToQueueAction,
  clearQueue as clearQueueAction
} from '../redux/player/playerActions';

import SongListItem from './SongListItem';
import Player from './Player';
// import Sidebar from './Sidebar';
import SettingsDialog from './SettingsDialog';

import shuffle from '../util/shuffle';
import getArrayOfFiles from '../util/getArrayOfFiles';
import { toggleSettingsModal as toggleSettingsModalAction } from '../redux/settings/settingsActions';
import { settingsPropType } from '../redux/settings/settingsReducer';

const Button = props => <MUIButton variant="outlined" {...props} />;

const useStyles = makeStyles({
  '@global': {
    body: {
      fontFamily: 'Sans Serif',
      margin: 0,
      height: '100vh',
      transitionDuration: '0.2s',
      overflow: 'hidden',
      backgroundColor: 'transparent',
      borderRadius: 6,
      background: ({ transparentMode, backgroundColor = '#000' }) =>
        transparentMode ? 'transparent' : backgroundColor,
      padding: ({ transparentMode, windowPadding = 20 }) =>
        transparentMode ? windowPadding : 0,

      '& #root': {
        borderRadius: 6,
        position: 'relative',
        minHeight: '100%'
      },

      '&:hover': {
        boxShadow: '0 0 3px 1px #aaa4 inset',
        '&$draggable': {
          opacity: 1
        }
      }
    },
    '*::-webkit-scrollbar': {
      width: 8
    },
    '*::-webkit-scrollbar-track': {
      // boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
      backgroundColor: 'transparent'
    },

    '*::-webkit-scrollbar-thumb': {
      backgroundColor: '#4444',
      outline: '1px solid slategrey',
      borderRadius: 4
    }
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0000',
    color: 'white',
    minHeight: '100%',
    overflow: 'hidden',
    borderRadius: 6
  },
  mainView: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    height: '100vh'
  },
  songsList: {
    flexGrow: 1,
    overflow: 'auto hidden',
    boxShadow: '0 1px  0 -4px #aaa2 inset, 0 -4px  0 0 #aaa2 inset',
    overflowY: 'hidden'
  },
  buttonContainer: {
    margin: '0 5px',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: 'calc(100% - 70px)'
  },
  draggable: {
    position: 'absolute',
    WebkitAppRegion: 'drag',
    minWidth: 30,
    width: 40,
    cursor: 'grab',
    right: 8,
    top: 0,
    zIndex: 99999,
    color: '#FFF4',
    background: '#0000',
    border: '1px solid #FFF1',
    opacity: 4
  }
});

const Row = memo(({ data, index, style }) => {
  const metaData = data[index];
  return metaData ? (
    <SongListItem style={style} key={metaData.id} metaData={metaData} />
  ) : null;
}, areEqual);

Row.propTypes = {
  data: PropTypes.shape().isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.shape().isRequired
};

const Home = ({
  songs,
  player,
  addSongs,
  addSongsToQueue,
  clearQueue,
  toggleSettingsModal,
  settings
}) => {
  const [expandedView, setExpadedView] = useState(false);
  const { all: allSongs } = songs;
  const { activeSongId } = player;
  const buttonContainerRef = createRef();

  const classes = useStyles(settings);

  const chooseFolderDialog = async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog(
      remote.BrowserWindow.getFocusedWindow(),
      {
        properties: ['openDirectory']
      }
    );

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

  const shuffleAll = () => {
    clearQueue();
    const songIds = shuffle([...Object.values(allSongs).map(({ id }) => id)]);
    addSongsToQueue(songIds);
  };

  const activeSong = allSongs[activeSongId];

  return (
    <div className={classes.container}>
      {/* <Sidebar chooseFolderDialog={chooseFolderDialog} /> */}
      <div className={classes.mainView}>
        <div
          style={expandedView ? { visibility: 'hidden' } : {}}
          className={classes.buttonContainer}
          ref={buttonContainerRef}
        >
          <Button className="iconButton" onClick={toggleSettingsModal}>
            <Icon>settings</Icon>
          </Button>
          <Button onClick={chooseFolderDialog}>
            <Icon>add</Icon>
            <span>Add Songs</span>
          </Button>
          <Button onClick={playAll}>
            <Icon>play_arrow</Icon>
            <span>Play All</span>
          </Button>
          <Button onClick={shuffleAll}>
            <Icon>shuffle</Icon>
            <span>Shuffle ALL</span>
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
  toggleSettingsModal: PropTypes.func.isRequired,
  settings: settingsPropType.isRequired
};

const mapStateToProps = ({ songs, player, settings }) => ({
  songs,
  player,
  settings
});

const mapDispatchToProps = {
  addSongs: addSongsAction,
  addSongsToQueue: addSongsToQueueAction,
  clearQueue: clearQueueAction,
  toggleSettingsModal: toggleSettingsModalAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
