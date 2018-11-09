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
      showEvacuateConfirm: false,
      userInfo: null,
      area: null,
      isDemo: false,
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

      this.updateShelters(value.lat, value.lng, this.state.isDemo);
      this.updateArea(value.lat, value.lng, this.state.isDemo);
    }).catch((error) => {
      console.error(error);
    });

    this.setState({isLogin: auth.isLogin()});
    if (auth.isLogin()) {
      api.getUserInfo().then((userInfo) => {
        console.log(userInfo);
        this.setState({userInfo: userInfo});
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  // 3km以内の避難所一覧を取得
  updateShelters(lat, lng, isDemo) {
    api.getShelters(lat, lng, 3000, isDemo).then((shelters) => {
      let showConfirm = false;
      if (shelters.length > 0 && shelters[0].distance <= process.env.REACT_APP_NEAR_THRESHOLD_METER) {
        showConfirm = true;
      }
      this.setState({
        shelters: shelters,
        showEvacuateConfirm: showConfirm,
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  // 周辺情報の取得
  updateArea(lat, lng, isDemo) {
    api.getArea(lat, lng, isDemo).then((area) => {
      console.log(area);
      this.setState({area: area});
    }).catch((error) => {
      console.error(error);
    });
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
    this.setState({showEvacuateConfirm: false});
    api.postEvacuate(75, true).then(() => {
      console.log('避難完了登録しました');
    }).catch((error) => {
      console.error(error);
    });
  }

  toggleDemoMode(isDemo) {
    this.setState({isDemo: isDemo});
    this.updateShelters(this.state.location.lat, this.state.location.lng, isDemo);
    this.updateArea(this.state.location.lat, this.state.location.lng, isDemo);
  }

  render() {
    return (
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            <Typography variant='h6' color='inherit' component={Link} to="/" style={{flex: 1, textDecoration: 'none'}}>
              Mizukuru Map
              {this.state.isDemo ? " - Demo" : null}
            </Typography>
            {this.state.isDemo ?
              <Button color="inherit" onClick={() => this.toggleDemoMode(false)}>Normal</Button>
              :
              <Button color="inherit" onClick={() => this.toggleDemoMode(true)}>Demo</Button>
            }
            {this.state.isLogin ?
              <Button color="inherit" onClick={() => this.logout()}>Logout</Button>
              :
              <Button color="inherit" component={Link} to="/login">Login</Button>
            }
          </Toolbar>
        </AppBar>

        <Grid container justify='center' spacing={8} style={{padding: '10px'}}>

          {this.state.showEvacuateConfirm ?
            <Grid item xs={12}>
              <Paper
                style={{
                  padding: "5px",
                  boxShadow: 'none',
                  border: `solid 2px ${theme.palette.secondary.light}`,
                  textAlign: 'center',
                }}
              >
                <Typography>
                  あなたは{this.state.shelters[0].name}の近くにいます．
                </Typography>
                <Button
                  size="small" variant="outlined" color="secondary" style={{margin: "0px 5px"}}
                  onClick={this.evacuate.bind(this)}
                >
                  避難完了
                </Button>
                <Button
                  size="small" variant="outlined" style={{margin: "0px 5px"}}
                  onClick={() => this.setState({showEvacuateConfirm: false})}
                >
                  キャンセル
                </Button>
              </Paper>
            </Grid>
            : null}

          {this.state.area ?
            <Grid item xs={12}>
              <Dashboard
                pickShelter={this.pickShelter.bind(this)}
                canUseLocation={this.state.canUseGeolocation}
                userInfo={this.state.userInfo}
                area={this.state.area}
              />
            </Grid>
            : null}

          {this.state.canUseGeolocation ?
            <Grid item xs={12} md={5}>
              <Card style={{height: theme.googleMap.height}}>
                <CardContent style={{padding: 0, textAlign: 'center'}}>
                  {/*{this.state.location ?*/}
                  {/*<ShelterMap*/}
                  {/*myPosition={this.state.location}*/}
                  {/*shelters={this.state.shelters}*/}
                  {/*pickShelter={this.pickShelter.bind(this)}*/}
                  {/*/>*/}
                  {/*:*/}
                  <CircularProgress color="secondary" style={{marginTop: '180px'}}/>
                  {/*}*/}
                </CardContent>
              </Card>
            </Grid>
            :
            <Typography>GPSを使用できません</Typography>
          }

          <Grid item xs={12} md={7}>
            <Card>
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
            isDemo={this.state.isDemo}
          />
        </Drawer>
      </React.Fragment>
    )
  }
}
