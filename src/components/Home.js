import React, { useState } from "react";
import PropTypes from "prop-types";
import path from "path";
import makeStyles from "@material-ui/styles/makeStyles";
import uuid from "uuid";
import { connect } from "react-redux";
import fs from "fs";
import * as mm from "music-metadata";
import { remote } from "electron";

import { addSongs as addSongsAction } from "../redux/songs/songsActions";
import { addSongsToQueue as addSongsToQueueAction } from "../redux/player/playerActions";
import SongListItem from "./SongListItem";
import Player from "./Player";
import Sidebar from "./Sidebar";

const readFile = filePath => {
  return mm.parseFile(filePath).catch(err => {
    console.error(err.message);
  });
};

const useStyles = makeStyles({
  "@global": {
    body: {
      fontFamily: "Sans Serif",
      margin: 0,
      padding: 0
    },
    "*::-webkit-scrollbar": {
      width: 8
    },
    "*::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)"
    },

    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "#444",
      outline: "1px solid slategrey",
      borderRadius: 4
    }
  },
  container: {
    display: "flex",
    backgroundColor: "#223",
    color: "white",
    height: "100vh"
  },
  mainView: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  },
  songsList: {
    flexGrow: 1,
    overflow: "auto"
  }
});

const Home = ({ songs, player, addSongs, addSongsToQueue }) => {
  const [folderPath, setFolderPath] = useState("");

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
      } else {
        const file = await readFile(entry);
        if (file) {
          const {
            common: { album, artist, picture },
            format: { codec }
          } = file;
          let {
            common: { title }
          } = file;

          if (!title) {
            [title] = entry.split("/").slice(-1);
          }

          addSongs([
            {
              albumArt: picture && picture[0],
              codec,
              title,
              artist,
              album,
              id: uuid(),
              location: entry
            }
          ]);
        }
      }
    });
  };

  const chooseFolderDialog = async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });

    if (!canceled) {
      setFolderPath(filePaths[0]);
      readTree(filePaths[0]);
    }
  };

  const playAll = () => {
    const songIds = Object.values(allSongs).map(({ id }) => id);
    addSongsToQueue(songIds);
  };

  const activeSong = allSongs[activeSongId];

  return (
    <div className={classes.container}>
      <Sidebar />
      <div className={classes.mainView}>
        <div>
          <button type={"button"} onClick={chooseFolderDialog}>
            Choose folders
          </button>
          <p>{folderPath}</p>
        </div>
        <div>
          <button type={"button"} onClick={playAll}>
            Play All
          </button>
        </div>
        <div className={classes.songsList}>
          {Object.values(allSongs).map(metaData => (
            <SongListItem
              playing={metaData.id === activeSongId && playing}
              key={metaData.id}
              metaData={metaData}
            />
          ))}
        </div>
        <Player song={activeSong} playerState={player} />
      </div>
    </div>
  );
};

Home.propTypes = {
  songs: PropTypes.shape({
    all: PropTypes.arrayOf(PropTypes.shape({})).isRequired
  }).isRequired,
  player: PropTypes.shape({
    activeSongId: PropTypes.string,
    playing: PropTypes.bool
  }).isRequired,
  addSongs: PropTypes.func.isRequired,
  addSongsToQueue: PropTypes.func.isRequired
};

const mapStateToProps = ({ songs, player }) => ({
  songs,
  player
});

const mapDispatchToProps = {
  addSongs: addSongsAction,
  addSongsToQueue: addSongsToQueueAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
