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
  friendList: {
    rowPerPage: 5,
  },
  dashboard: {
    dangerMeter: {
      colors: [
        "#8fe516",
        "#e5e516",
        "#e58f16",
        "#e53916", // HSB=(10,90,90)
      ],
    }
  },
});

export default theme;