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
    MuiDialog: {
      paper: {
        background: '#000',
        color: '#FFF'
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
          borderColor: '#aaa4',
          boxShadow:
            '2px 1px 3px 1px #aaa2 inset, 12px 10px 20px 5px #aaa1 inset'
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
        color: '#52af77',
        height: 4
      },
      thumb: {
        height: 15,
        width: 15,
        backgroundColor: '#fff',
        // border: "2px solid currentColor",
        transformOrigin: 'center',
        transform: 'translate(0, 0)',
        boxShadow: '0 0 4px 2px #fff6',
        '&:hover,&$active': {
          boxShadow: 'inherit',
          transform: 'scale(1.2)'
        }
      },
      active: {},
      valueLabel: {
        left: 'calc(-50% + 4px)'
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
