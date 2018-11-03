import React, {Component} from 'react';
import {theme} from '../contains/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default class Home extends Component {
  render(){
    return(
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant='h6' color='inherit' style={{flex: 1}}>
                Mizukuru Map
              </Typography>
              <Button color="inherit" href="/login">Login</Button>
            </Toolbar>
          </AppBar>
        </MuiThemeProvider>
      </React.Fragment>
    )
  }
}
