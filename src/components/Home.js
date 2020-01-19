import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import makeStyles from '@material-ui/styles/makeStyles';
import { FixedSizeList as List, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import uuid from 'uuid';
import { Button as MUIButton, Icon } from '@material-ui/core';
import * as mm from 'music-metadata';
import { connect } from 'react-redux';

import fs from 'fs';
import { remote } from 'electron';

import { addSongs as addSongsAction } from '../redux/songs/songsActions';
import {
  addSongsToQueue as addSongsToQueueAction,
  clearQueue as clearQueueAction
} from '../redux/player/playerActions';
import SongListItem from './SongListItem';
import Player from './Player';
import Sidebar from './Sidebar';
import shuffle from '../util/shuffle';

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
      backgroundColor: '#444',
      outline: '1px solid slategrey',
      borderRadius: 4
    }
  },
  container: {
    display: 'flex',
    backgroundColor: '#0008',
    color: 'white',
    height: '100vh',
    overflow: 'hidden'
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
    display: 'flex',
    '& > button': {
      margin: '10px 5px',
      color: '#FFFFFF',
      borderColor: '#aaa4',
      '& .material-icons': {
        marginRight: 5
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

const Home = ({ songs, player, addSongs, addSongsToQueue, clearQueue }) => {
  const [folderPath, setFolderPath] = useState('');

  const { all: allSongs } = songs;
  const { activeSongId, playing } = player;

  const classes = useStyles();

  const readTree = entry => {
    fs.lstat(entry, async (err, stat) => {
      if (err) throw err;
      if (stat.isDirectory()) {
        fs.readdir(entry, (readdirErr, files) => {
          if (readdirErr) throw readdirErr;
          files.forEach(file => {
            readTree(path.join(entry, file));
          });
        });
      } else if (
        ['mp3', 'flac', 'ogg', 'webm'].includes(entry.split('.').slice(-1)[0])
      ) {
        // const file = await readFile(entry);
        // if (file) {
        //   const {
        //     common: { album, artist, picture },
        //     format: { codec }
        //   } = file;
        //   let {
        //     common: { title }
        //   } = file;

        //   if (!title) {
        //     [title] = entry.split("/").slice(-1);
        //   }

        addSongs([
          {
            // albumArt: picture && picture[0],
            // codec,
            // title,
            // artist,
            // album,
            id: uuid(),
            location: entry
          }
        ]);
        // }
      }
    });
  };

  const chooseFolderDialog = async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (!canceled) {
      setFolderPath(filePaths[0]);
      readTree(filePaths[0]);
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
        <div className={classes.buttonContainer}>
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
        <div className={classes.songsList}>
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
        <Player activeSong={activeSong} playerState={player} />
        <Button
          style={{
            WebkitAppRegion: 'drag',
            minWidth: 30,
            width: 40,
            cursor: 'grab',
            right: 6,
            top: 6,
            position: 'absolute',
            zIndex: 99999,
            color: '#FFF8',
            background: '#FFF2'
          }}
        >
          <Icon>drag_indicator</Icon>
        </Button>
      </div>
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
  clearQueue: PropTypes.func.isRequired
};

const mapStateToProps = ({ songs, player }) => ({
  songs,
  player
});

const mapDispatchToProps = {
  addSongs: addSongsAction,
  addSongsToQueue: addSongsToQueueAction,
  clearQueue: clearQueueAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
