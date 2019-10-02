import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "#222",
    "& > div": {
      display: "flex",
      flexDirection: "column",
      padding: "20px 10px",
      "& > button": {
        color: "#ccc",
        "&:hover": {
          color: "#fda"
        }
      }
    }
  }
});

function Sidebar() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <IconButton>
          <Icon>album</Icon>
        </IconButton>
        <IconButton>
          <Icon>person</Icon>
        </IconButton>
        <IconButton>
          <Icon>playlist_play</Icon>
        </IconButton>
        <IconButton>
          <Icon>folder</Icon>
        </IconButton>
      </div>
      <div>
        <IconButton>
          <Icon>settings</Icon>
        </IconButton>
      </div>
    </div>
  );
}

Sidebar.propTypes = {};

export default Sidebar;
