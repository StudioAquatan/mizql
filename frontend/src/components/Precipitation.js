import React, {Component} from 'react';
import {
  AreaChart, Area,
  ResponsiveContainer,
  XAxis, YAxis
} from 'recharts';
import {Grid, Typography} from '@material-ui/core';
import theme from '../config/theme';
import moment from 'moment';

export default class Precipitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.convertRainData(this.props.rain),
    };
    console.log(props.rain);
  }

  convertRainData(rain) {
    let data = [];
    rain.forecasts.forEach((elm) => {
      data.push({
        amount: elm.amount,
        time: moment(elm.created_at).unix(),
      });
    });
    rain.observations.forEach((elm) => {
      data.push({
        amount: elm.amount,
        time: moment(elm.created_at).unix(),
      });
    });
    return data.reverse();
  }

  formatXAxis = (tickItem) => {
    return moment.unix(tickItem).format('HH:mm');
  };

  render() {
    if (!this.state.data.length) {
      return null;
    }

    return (
      <Grid
        item xs={12} md={5} lg={5} xl={5}
        style={{textAlign: 'center'}}
      >
        <ResponsiveContainer width='100%' height={200}>
          <AreaChart data={this.state.data}>
            <XAxis
              dataKey="time"
              tickFormatter={this.formatXAxis}
              tick={{fontSize: 11}}
            />
            <YAxis
              tick={{fontSize: 11}}
            />
            <Area
              type="monotone" dataKey="amount"
              storoke={theme.palette.primary.dark}
              fill={theme.palette.primary.light}
            />
          </AreaChart>
        </ResponsiveContainer>
        <Typography variant="h6">
          降水量
        </Typography>
      </Grid>
    );
  }
}