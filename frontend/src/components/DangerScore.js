import React, {Component} from 'react';
import ReactD3Gauge from 'react-d3-gauge';
import {Typography, Grid} from '@material-ui/core';
import theme from '../config/theme';
import ReactSpeedometer from 'react-d3-speedometer';

export default class DangerScore extends Component {
  normalizeLevel = (score) => {
    if (!score) {
      return 0
    } else if (score > 5) {
      return 5
    }
    return score;
  };

  getDisplayMessage = (score) => {
    switch (score) {
      case 0:
        return "問題なし";
      case 1:
        return "問題ない";
      case 2:
        return "注意";
      case 3:
        return "危険";
      case 4:
        return "非常に危険";
      case 5:
        return "とてつもなく危険";
      default:
        return "";
    }
  };

  render() {
    return (
      <Grid item xs={12} md={4} lg={4} xl={4} style={{textAlign: 'center'}}>
          <div style={{height: '300px', width: 'auto'}}>
            <ReactSpeedometer
              fluidWidth={true}
              maxValue={5}
              needleColor={theme.palette.primary.dark}
              value={this.normalizeLevel(this.props.level)}
              startColor={theme.dashboard.dangerMeter.startColor}
              endColor={theme.dashboard.dangerMeter.endColor}
              currentValueText={this.getDisplayMessage(this.props.level)}
            />
          </div>
      </Grid>
    );
  }
}
