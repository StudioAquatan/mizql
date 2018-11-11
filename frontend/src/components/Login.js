import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  AppBar,
  Button,
  Card, CardContent,
  FormControl,
  Grid,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';
import * as auth from '../modules/auth';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  handleLogin(){
    auth.login(this.state.username, this.state.password).then((res) => {
      if (res) {
        this.props.history.push('/');
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        <AppBar title="Header" position="static">
          <Toolbar>
            <Typography variant='h6' color='inherit' component={Link} to="/" style={{flex: 1, textDecoration: 'none'}}>
              Mizukuru Map
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container justify='center'>
          <Grid item xs={10} sm={8} md={7} lg={6} xl={5}>
            <Card style={{marginTop: 30, padding: 20}}>
              <CardContent style={{textAlign: 'center'}}>
                <FormControl style={{width: '100%'}}>
                  <TextField
                    required
                    label="Username"
                    margin="normal"
                    onChange={(e) => this.setState({username: e.target.value})}
                  />
                  <TextField
                    required
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    onChange={(e) => this.setState({password: e.target.value})}
                  />
                  <Button
                    style={{
                      marginTop: 16,
                      marginBottom: 8,
                      boxShadow: 'none',
                    }}
                    variant="contained"
                    color="primary"
                    onClick={this.handleLogin.bind(this)}
                  >
                    Login
                  </Button>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}
