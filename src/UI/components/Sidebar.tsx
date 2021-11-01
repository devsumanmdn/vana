import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: '#222',
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 10px',
      '& > button': {
        color: '#ccc',
        border: '1px solid #ccc',
        borderRadius: '50%',
        padding: 4,
        '&:hover': {
          color: '#fda',
        },
      },
    },
  },
});

function Sidebar({ chooseFolderDialog }: any) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <IconButton onClick={chooseFolderDialog}>
          <Icon>add</Icon>
        </IconButton>
        {/*<IconButton>
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
        </IconButton>*/}
      </div>
    </div>
  );
}

Sidebar.propTypes = {};

export default Sidebar;
