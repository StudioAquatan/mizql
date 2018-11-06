import React, {Component} from 'react';
import {
  Button,
  Grid,
  Paper,
  Typography
} from '@material-ui/core';
import {KeyboardArrowDown} from '@material-ui/icons';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import * as mockdata from '../config/mockdata';
import * as location from '../modules/location';
import theme from '../config/theme';

export default class ShelterDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shelter: props.shelter,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Button color="inherit" onClick={() => this.props.pickShelter(null)} style={{backgroundColor: "#fafafa"}}>
          <KeyboardArrowDown/>
        </Button>
        <Grid container justify="center" style={{padding: "10px"}}>
          <Grid item xs={12} lg={6} xl={6}>
            <Paper style={{padding: "20px", margin: "5px"}}>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={mockdata.evacuees}>
                  <XAxis dataKey="time"/>
                  <YAxis/>
                  <Bar dataKey="num" fill={theme.palette.secondary.light}/>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6} xl={6}>
            <Paper
              justify="center"
              style={{padding: "20px", margin: "5px", height: '300px'}}
            >
              <Typography variant="h5">{this.state.shelter.name}</Typography>
              <Typography>{this.state.shelter.distance} m</Typography>
              <Typography>{this.state.shelter.address}</Typography>
              <Button
                style={{boxShadow: 'none'}}
                variant="contained"
                color="secondary"
                href={location.getGoogleMapRouteLink(this.props.myPosition, {lat: this.state.shelter.lat, lng: this.state.shelter.lon})}
              >
                ルートを表示
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
