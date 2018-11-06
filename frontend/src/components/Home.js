import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  AppBar,
  Button,
  Card, CardContent,
  CircularProgress,
  Drawer,
  Grid,
  Typography,
  Toolbar,
} from '@material-ui/core';
import * as location from '../modules/location';
import * as auth from '../modules/auth';
import * as mockdata from "../config/mockdata";
import ShelterMap from "./Map";
import ShelterList from './ShelterList';
import Information from './Information';
import ShelterDetail from './ShelterDetail';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      canUseGeolocation: location.canGetPosition(),
      shelters: mockdata.shelters,
      pickShelter: null,
      showDetail: false,
      isLogin: false,
    };
  }

  componentDidMount() {
    location.getPosition().then((value) => {
      this.setState({
        location: {
          lat: value.lat,
          lng: value.lng,
        },
      });
    }).catch((error) => {
      console.error(error);
    });
    this.setState({isLogin: auth.isLogin()})
  }

  pickShelter(shelter) {
    if (!shelter) {
      this.setState({
        pickShelter: null,
        showDetail: false,
      });
    } else {
      this.setState({
        pickShelter: shelter,
        showDetail: true,
      });
    }
    console.log(shelter);
  }

  logout() {
    auth.logout();
    alert('ログアウトしました');
    this.setState({isLogin: false});
  }

  render() {
    return (
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            <Typography variant='h6' color='inherit' component={Link} to="/" style={{flex: 1, textDecoration: 'none'}}>
              Mizukuru Map
            </Typography>
            {this.state.isLogin ?
              <Button color="inherit" onClick={() => this.logout()}>Logout</Button>
              :
              <Button color="inherit" component={Link} to="/login">Login</Button>}
          </Toolbar>
        </AppBar>

        <Grid container justify='center'>
          <Grid item xs={12} md={6}>
            <Card style={{margin: 10, height: '400px'}}>
              <CardContent>
                <Information/>
              </CardContent>
            </Card>
          </Grid>

          {this.state.canUseGeolocation ?
            <Grid item xs={12} md={6} justify="center">
              <Card style={{margin: 10, height: '400px'}}>
                <CardContent style={{padding: 0, textAlign: 'center'}}>
                  {this.state.location ?
                      <ShelterMap
                      myPosition={this.state.location}
                      shelters={this.state.shelters}
                      pickShelter={this.pickShelter.bind(this)}
                      />
                    :
                    <CircularProgress color="secondary" style={{margin: '0 auto'}}/>
                  }
                </CardContent>
              </Card>
            </Grid>
            :
            <Typography>GPSを使用できません</Typography>
          }

          <Grid item xs={12}>
            <Card style={{margin: 10}}>
              <CardContent style={{padding: 0, textAlign: 'center'}}>
                <ShelterList shelters={this.state.shelters} pickShelter={this.pickShelter.bind(this)}/>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Drawer
          anchor="bottom"
          open={this.state.showDetail}
          onClose={() => this.pickShelter(null)}
        >
          <ShelterDetail
            shelter={this.state.pickShelter}
            pickShelter={this.pickShelter.bind(this)}
          />
        </Drawer>
      </React.Fragment>
    )
  }
}
