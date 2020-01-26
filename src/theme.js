import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    color: {
      default: '#fff'
    },
    background: {
      default: '#000'
    }
  },
  overrides: {
    MuiListItemText: {
      secondary: {
        color: '#aaa'
      }
    },
    MuiDialog: {
      paper: {
        background: '#FFF',
        color: '#888'
      }
    },
    MuiFormLabel: {
      root: {
        color: 'inherit'
      }
    },
    MuiButton: {
      root: {
        margin: '10px 5px',
        color: '#FFFFFF',
        backgroundColor: '#aaa2',

        '&$outlined': {
          borderColor: '#FFF6',
          boxShadow: '0 0 3px 1px #aaa2 inset, 0 0 20px 5px #aaa1 inset'
        },

        '&.iconButton': {
          paddingLeft: 0,
          paddingRight: 0,
          minWidth: 40
        },
        '& .material-icons:not(:last-child)': {
          marginRight: 5
        }
      }
    },
    MuiSlider: {
      root: {
        color: '#52af77'
        // height: 4
      },
      thumb: {
        transitionDuration: '0.2s',
        overflow: 'visible',
        backgroundColor: '#52af77',
        boxShadow: '0 0 1px 2px #fff inset, 0 0 4px 1px #52af7788',
        marginTop: -4,
        marginLeft: -8,
        '&:hover,&$active': {
          boxShadow: '0 0 1px 2px #fff inset',
          transform: 'scale(1.2)'
        }
      },
      track: {
        height: 4,
        borderRadius: 2
      },
      rail: {
        height: 4,
        borderRadius: 2
      }
    }
  }
});

export default theme;
