import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {GetPosition} from '../modules/location';
import {MapComponent} from "./Map";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      canUseGeolocation: null,
    };
  }

  componentDidMount() {
    GetPosition().then((value) => {
      this.setState({
        location: {
          lat: value.lat,
          lng: value.lng,
        }
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <React.Fragment>
        <AppBar>
          <Toolbar>
            <Typography variant='h6' color='inherit' style={{flex: 1}}>
              Mizukuru Map
            </Typography>
            <Button color="inherit" href="/login">Login</Button>
          </Toolbar>
        </AppBar>
        {this.state.location ?
          <MapComponent
            myPosition={this.state.location}
          /> :
          this.state.canUseGeolocation ?
            <p>GPSを使用できません</p> :
            <p>現在地取得中です...</p>
        }
      </React.Fragment>
    )
  }
}
