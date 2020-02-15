import React, { useState, memo, createRef } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/styles/makeStyles';
import { FixedSizeList as List, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import uuid from 'uuid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
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

// const Button = props => <MUIButton variant="outlined" {...props} />;

const useStyles = makeStyles({
  '@global': {
    body: {
      background: ({ transparentMode, backgroundColor = '#444' }) =>
        transparentMode ? 'transparent' : backgroundColor
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
    overflowY: 'hidden'
  },
  buttonContainer: {
    WebkitAppRegion: 'drag',
    margin: '0 5px',
    display: 'flex',
    // alignSelf: 'flex-start',
    zIndex: 99999,

    '& button': {
      minWidth: 'fit-content',
      '-webkit-app-region': 'no-drag',
      '& .text': {
        whiteSpace: 'nowrap'
      }
    },

    '&.overflowing': {
      '& button': {
        overflow: 'hidden',
        minWidth: 40,
        '& .material-icons': {
          marginRight: 0
        },
        '& .text': {
          display: 'none'
        }
      }
    }
  }
});

const Row = memo(({ data, index, style }) => {
  const metaData = data[index];
  return metaData ? (
    <SongListItem style={style} key={metaData.id} metaData={metaData} />
  ) : null;
}, areEqual);

Row.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
  const buttonContainerRef = createRef();

  const { all: allSongs } = songs;
  const { activeSongId } = player;

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
          <Button
            title="Settings"
            className="iconButton"
            onClick={toggleSettingsModal}
          >
            <Icon>settings</Icon>
          </Button>
          <Button title="Add songs" onClick={chooseFolderDialog}>
            <Icon>add</Icon>
          </Button>
          <Button title="Play all songs" onClick={playAll}>
            <Icon>play_arrow</Icon>
          </Button>
          <Button title="Shuffle all songs" onClick={shuffleAll}>
            <Icon>shuffle</Icon>
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
