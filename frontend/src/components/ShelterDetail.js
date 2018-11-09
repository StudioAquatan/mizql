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
  ReferenceLine,
} from 'recharts';
import * as location from '../modules/location';
import * as api from '../modules/api';
import theme from '../config/theme';
import moment from 'moment';

export default class ShelterDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shelter: props.shelter,
      history: null,
    };
    console.log(this.state.shelter);
  }

  createHistoryData = (history) => {
    let data = [];
    history.forEach((elm) => {
      data.push({
        count: elm.count,
        time: moment(elm.created_at).format("HH:mm"),
      });
    });
    console.log(history);
    return data.reverse();
  };

  componentDidMount() {
    api.getShelterHistory(this.props.shelter.pk, this.props.isDemo).then((history) => {
      this.setState({history: history});
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <React.Fragment>
        <Button color="inherit" onClick={() => this.props.pickShelter(null)} style={{backgroundColor: "#fafafa"}}>
          <KeyboardArrowDown/>
        </Button>

        <Grid container justify="center" style={{padding: "10px"}}>
          {this.state.history ?
            <Grid item xs={12} lg={7} xl={7}>
              <Paper style={{padding: "20px", margin: "5px"}}>
                <Typography>避難受け入れ状況 ({this.state.history[0].count}/{this.state.shelter.capacity}人)</Typography>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={this.createHistoryData(this.state.history)}>
                    <XAxis dataKey="time"/>
                    <YAxis type="number" domain={[0, Math.round(this.state.shelter.capacity * 1.2)]}/>
                    <ReferenceLine y={this.state.shelter.capacity} stroke="red" strokeDasharray="3 3" label="Max"/>
                    <Bar dataKey="count" fill={theme.palette.secondary.light}/>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            : null
          }

          <Grid item xs={12} lg={5} xl={5}>
            <Paper
              justify="center"
              style={{padding: "20px", margin: "5px"}}
            >
              <Typography variant="h5">{this.state.shelter.name}</Typography>
              <Typography>({this.state.shelter.distance} m) {this.state.shelter.address}</Typography>
              {this.props.myPosition ?
                <Button
                  style={{boxShadow: 'none'}}
                  variant="contained"
                  color="secondary"
                  href={location.getGoogleMapRouteLink(this.props.myPosition, {
                    lat: this.state.shelter.lat,
                    lng: this.state.shelter.lon
                  })}
                >
                  ルートを表示
                </Button>
                : null}
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
