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
    height: '500px',
  },
});

export default theme;