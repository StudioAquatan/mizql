import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  handleLogin(){
    console.log('login');
    console.log(this.state.username);
    console.log(this.state.password);
    // TODO: Login API
  }

  render() {
    return (
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            <Typography variant='h6' color='inherit' style={{flex: 1}}>
              Mizukuru Map
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid
          container
          justify='center'
        >
          <Grid item>
            <Card
              style={{
                margin: 40,
                padding: 20,
              }}
            >
              <CardContent
                style={{textAlign: 'center'}}
              >
                <FormControl>
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
