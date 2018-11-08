import React, {Component} from 'react';
import {
  AreaChart, Area, Tooltip,
  ResponsiveContainer,
  XAxis, YAxis
} from 'recharts';
import {Typography} from '@material-ui/core';
import * as mockdata from '../config/mockdata';
import moment from 'moment';

export default class Precipitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.convertRainData(mockdata.area.rain),
    };
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
    console.log(tickItem);
    return moment.unix(tickItem).format('HH:mm');
  };

  render() {
    return (
      <React.Fragment>
        <Typography variant="h6">
          降水量
        </Typography>
        <ResponsiveContainer width='100%' height={200}>
          <AreaChart data={this.state.data}>
            <XAxis
              dataKey="time"
              tickFormatter={this.formatXAxis}
              tick={{fontSize: 11}}
            />
            <Tooltip/>
            <YAxis
              tick={{fontSize: 11}}
            />
            <Area
              type="monotone" dataKey="amount"
              storoke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  }
}