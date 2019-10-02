import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import makeStyles from "@material-ui/styles/makeStyles";
import PlayArrowRounded from "@material-ui/icons/PlayArrowRounded";
import PauseRounded from "@material-ui/icons/PauseRounded";

import {
  playSong as playSongAction,
  pauseSong as pauseSongAction
} from "../redux/player/playerActions";

const useStyles = makeStyles({
  root: {
    background: "black",
    borderTop: "1px solid #ddd2",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    color: "#808080",
    cursor: "default",
    "&:hover": {
      color: "lightgrey"
    }
  },
  playBtn: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #fff",
    borderRadius: "50%",
    height: 30,
    width: 30,
    marginRight: 10,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    cursor: "pointer",
    "& > svg": {
      fontSize: 18
    }
  },
  albumArt: {
    height: 40,
    width: 40,
    marginRight: 20
  }
});

function SongListItem({ metaData, playing, playSong, pauseSong }) {
  const { title } = metaData;

  const classes = useStyles();

  const albumArt = metaData && metaData.albumArt ? metaData.albumArt : false;

  const albumArtDataURL = albumArt
    ? `data:image/jpeg;base64,${albumArt.data.toString("base64")}`
    : undefined;

  const handlePlayPause = () => {
    if (playing) {
      pauseSong();
    } else {
      playSong(metaData.id);
    }
  };

  return (
    <div
      role={"presentation"}
      onClick={handlePlayPause}
      className={classes.root}
    >
      <img
        className={classes.albumArt}
        src={albumArtDataURL}
        alt={"albumArt"}
      />
      <button type={"button"} className={classes.playBtn}>
        {playing ? <PauseRounded /> : <PlayArrowRounded />}
      </button>
      <p>{title}</p>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio src={metaData.location} />
    </div>
  );
}

SongListItem.propTypes = {
  metaData: PropTypes.shape({
    location: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    albumArt: PropTypes.string
  }).isRequired,
  playing: PropTypes.bool.isRequired,
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  playSong: playSongAction,
  pauseSong: pauseSongAction
};

export default connect(
  null,
  mapDispatchToProps
)(SongListItem);
