import React, { useState, memo, createRef, useEffect } from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import { FixedSizeList as List, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { v4 as uuid } from "uuid";
import MUIButton from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RefreshIcon from "@mui/icons-material/Refresh";
import { connect } from "react-redux";

import { addSongs as addSongsAction } from "../redux/songs/songsActions";
import {
  addSongsToQueue as addSongsToQueueAction,
  clearQueue as clearQueueAction,
  playSong as playSongAction,
} from "../redux/player/playerActions";

import SongListItem from "./SongListItem";
import Player from "./Player";
// import Sidebar from './Sidebar';
import SettingsDialog from "./SettingsDialog";

import shuffle from "../util/shuffle";
import { toggleSettingsModal as toggleSettingsModalAction } from "../redux/settings/settingsActions";
import { settingsPropType } from "../redux/settings/settingsReducer";
import { resetAll } from "../redux/store";

const Button = (props) => <MUIButton {...props} />;

const useStyles = makeStyles({
  "@global": {
    body: {
      background: "transparent !important",
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#0000",
    color: "white",
    minHeight: "100%",
    overflow: "hidden",
    borderRadius: 6,
  },
  mainView: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
    height: "100vh",
  },
  songsList: {
    flexGrow: 1,
    overflow: "auto hidden",
    overflowY: "hidden",
  },
  buttonContainer: {
    WebkitAppRegion: "drag",
    margin: "10px",
    display: "flex",
    // alignSelf: 'flex-start',
    zIndex: 99999,

    "& button": {
      minWidth: "fit-content",
      color: "#fff",
      "-webkit-app-region": "no-drag",
      "& .text": {
        whiteSpace: "nowrap",
      },
    },

    "&.overflowing": {
      "& button": {
        overflow: "hidden",
        minWidth: 40,
        "& .material-icons": {
          marginRight: 0,
        },
        "& .text": {
          display: "none",
        },
      },
    },
  },
});

const Row = memo(({ data, index, style }: any) => {
  const metaData = data[index];
  return metaData ? (
    <SongListItem style={style} key={metaData.id} metaData={metaData} />
  ) : null;
}, areEqual);

// Row.propTypes = {
//   data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
//   index: PropTypes.number.isRequired,
//   style: PropTypes.shape().isRequired,
// };

const Home = ({
  songs,
  player,
  addSongs,
  playSong,
  addSongsToQueue,
  clearQueue,
  toggleSettingsModal,
  settings,
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const buttonContainerRef = createRef() as React.RefObject<HTMLDivElement>;

  const { all: allSongs } = songs;
  const { activeSongId } = player;

  const classes = useStyles(settings);

  useEffect(() => {
    if (expandedView) {
      window.maxBarHeight = 150;
    } else {
      window.maxBarHeight = 100;
    }
  }, [expandedView]);

  const chooseFolderDialog = async () => {
    const { canceled, filePaths } = await window.electron.openDirDialog();

    if (!canceled) {
      const listOfSongPaths = await window.electron.getArrayOfFiles(
        filePaths?.[0]
      );
      addSongs(listOfSongPaths.map((path) => ({ location: path, id: uuid() })));
    }
  };

  const playAll = () => {
    clearQueue();
    const songIds = Object.values(allSongs).map(({ id }) => id);
    addSongsToQueue(songIds);
    if (songIds[0]) {
      playSong(songIds[0]);
    }
  };

  const shuffleAll = () => {
    clearQueue();
    const songIds = shuffle([...Object.values(allSongs).map(({ id }) => id)]);
    addSongsToQueue(songIds);
    if (songIds[0]) {
      playSong(songIds[0], true);
    }
  };

  const activeSong = allSongs[activeSongId];

  return (
    <div className={classes.container}>
      {/* <Sidebar chooseFolderDialog={chooseFolderDialog} /> */}
      <div className={classes.mainView}>
        <div
          // style={{ visibility: 'hidden' }}
          className={classes.buttonContainer}
          ref={buttonContainerRef}
          id="mainActions"
        >
          <Button
            title="Settings"
            className="iconButton"
            onClick={toggleSettingsModal}
          >
            <SettingsIcon />
          </Button>
          <Button title="Add songs" onClick={chooseFolderDialog}>
            <AddIcon />
          </Button>
          <Button title="Play all songs" onClick={playAll}>
            <PlayArrowIcon />
          </Button>
          <Button title="Shuffle all songs" onClick={shuffleAll}>
            <ShuffleIcon />
          </Button>
          <Button title="Reset" onClick={resetAll}>
            <RefreshIcon />
          </Button>
        </div>
        <div
          style={
            expandedView || player.showQueue
              ? { visibility: "hidden", maxHeight: 0 }
              : {}
          }
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
          setExpandedView={setExpandedView}
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
    all: PropTypes.objectOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  player: PropTypes.shape({
    activeSongId: PropTypes.string,
    playing: PropTypes.bool,
    showQueue: PropTypes.bool.isRequired,
  }).isRequired,
  addSongs: PropTypes.func.isRequired,
  addSongsToQueue: PropTypes.func.isRequired,
  clearQueue: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired,
  toggleSettingsModal: PropTypes.func.isRequired,
  settings: settingsPropType.isRequired,
};

const mapStateToProps = ({ songs, player, settings }) => ({
  songs,
  player,
  settings,
});

const mapDispatchToProps = {
  addSongs: addSongsAction,
  addSongsToQueue: addSongsToQueueAction,
  clearQueue: clearQueueAction,
  playSong: playSongAction,
  toggleSettingsModal: toggleSettingsModalAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
