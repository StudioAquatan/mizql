import React, {Component} from 'react';
import ReactD3Gauge from 'react-d3-gauge';
import {Typography, Grid} from '@material-ui/core';
import theme from '../config/theme';

export default class DangerScore extends Component {
  convertLevel = (score) => {
    if (!score) {
      return 0
    } else if (score > 4) {
      return 100
    }
    return score * 25 - 25 / 2;
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
    const level = this.convertLevel(this.props.level);
    const msg = this.getDisplayMessage(this.props.level);

    return (
      <Grid
        item xs={12} md={4} lg={4} xl={4}
        style={{textAlign: 'center'}}
      >
        <React.Fragment>
          <ReactD3Gauge
            needleColor={theme.palette.primary.dark}
            colors={theme.dashboard.dangerMeter.colors}
            percent={level}
          />
          <Typography variant="h6">{msg}</Typography>
        </React.Fragment>
      </Grid>
    );
  }
}
