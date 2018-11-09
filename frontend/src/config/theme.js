import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#3492ca',
      main: '#0277bd',
      dark: '#015384',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f6685e',
      main: '#f44336',
      dark: '#aa2e25',
      contrastText: '#fff',
    },
  },
  googleMap: {
    height: '600px',
  },
  friendList: {
    rowPerPage: 5,
  },
  dashboard: {
    dangerMeter: {
      startColor: "#75d701",
      endColor: "#ff7473",
    }
  },
});

export default theme;