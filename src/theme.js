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
        borderColor: '#aaa4',
        '& .material-icons': {
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
