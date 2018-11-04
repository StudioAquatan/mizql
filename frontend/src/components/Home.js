import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {GetPosition} from '../modules/location';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      canUseGeolocation: null,
    };
  }

  componentDidMount() {
    console.log("get location");
    GetPosition().then((value) => {
      console.log(value);
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
        <AppBar position="static">
          <Toolbar>
            <Typography variant='h6' color='inherit' style={{flex: 1}}>
              Mizukuru Map
            </Typography>
            <Button color="inherit" href="/login">Login</Button>
          </Toolbar>
        </AppBar>
        {this.state.location ?
          <div>
            <p>緯度 : {this.state.location.lat}</p>
            <p>軽度 : {this.state.location.lng}</p>
          </div> :
          this.state.canUseGeolocation ?
            <p>GPSを使用できません</p> :
            <p>現在地取得中です...</p>
        }
      </React.Fragment>
    )
  }
}
