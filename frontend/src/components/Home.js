import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  AppBar,
  Button,
  Card, CardContent,
  CircularProgress,
  Drawer,
  Grid,
  Paper,
  Typography,
  Toolbar,
} from '@material-ui/core';
import * as location from '../modules/location';
import * as auth from '../modules/auth';
import * as mockdata from "../config/mockdata";
import * as api from "../modules/api";
import ShelterMap from "./Map";
import ShelterList from './ShelterList';
import Dashboard from './Dashboard';
import ShelterDetail from './ShelterDetail';
import theme from '../config/theme';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      canUseGeolocation: location.canGetPosition(),
      shelters: [],
      pickShelter: null,
      showDetail: false,
      isLogin: false,
      isNearShelter: true,
      userInfo: null,
      area: null,
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

      api.getShelters(value.lat, value.lng, 1000).then((shelters) => {
        console.log(shelters);
        console.log(value);
        this.setState({shelters: shelters,});
      }).catch((error) => {
        console.error(error);
      });

      api.getArea(value.lat, value.lng).then((area) => {
        console.log(area);
        this.setState({area: area});
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });

    this.setState({isLogin: auth.isLogin()})
    if (auth.isLogin()) {
      api.getUserInfo().then((userInfo) => {
        console.log(userInfo);
        this.setState({userInfo: userInfo});
      }).catch((error) => {
        console.error(error);
      });
    }
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
  }

  logout() {
    auth.logout();
    alert('ログアウトしました');
    this.setState({isLogin: false});
  }

  evacuate() {
    this.setState({isNearShelter: false});
    console.log('避難完了登録しました');
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

          {this.state.isNearShelter ?
            <Grid item xs={12}>
              <Paper
                style={{
                  margin: "5px 10px 0px 10px",
                  padding: '5px',
                  boxShadow: 'none',
                  border: `solid 2px ${theme.palette.secondary.light}`,
                  textAlign: 'center',
                }}
              >
                <Typography>
                  あなたは{mockdata.shelters[0].name}の近くにいます．
                </Typography>
                <Button
                  size="small" variant="outlined" color="secondary" style={{margin: "0px 5px"}}
                  onClick={this.evacuate.bind(this)}
                >
                  避難完了
                </Button>
                <Button
                  size="small" variant="outlined" style={{margin: "0px 5px"}}
                  onClick={() => this.setState({isNearShelter: false})}
                >
                  キャンセル
                </Button>
              </Paper>
            </Grid>
            : null}

          <Grid item xs={12} style={{margin: 10}}>
            <Dashboard
              pickShelter={this.pickShelter.bind(this)}
              canUseLocation={this.state.canUseGeolocation}
              userInfo={this.state.userInfo}
              area={this.props.area}
            />
          </Grid>

          {this.state.canUseGeolocation ?
            <Grid item xs={12} md={6}>
              <Card style={{margin: 10, marginTop: 0, height: theme.googleMap.height}}>
                <CardContent style={{padding: 0, textAlign: 'center'}}>
                  {this.state.location ?
                    <ShelterMap
                      myPosition={this.state.location}
                      shelters={this.state.shelters}
                      pickShelter={this.pickShelter.bind(this)}
                    />
                    :
                    <CircularProgress color="secondary" style={{marginTop: '180px'}}/>
                  }
                </CardContent>
              </Card>
            </Grid>
            :
            <Typography>GPSを使用できません</Typography>
          }

          <Grid item xs={12} md={6}>
            <Card style={{margin: 10, marginTop: 0}}>
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
            myPosition={this.state.location}
            shelter={this.state.pickShelter}
            pickShelter={this.pickShelter.bind(this)}
          />
        </Drawer>
      </React.Fragment>
    )
  }
}
