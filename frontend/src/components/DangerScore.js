import React, {Component} from 'react';
import ReactD3Gauge from 'react-d3-gauge';
import {Typography} from '@material-ui/core';
import theme from '../config/theme';

export default class DangerScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 0,
    };
  }

  convertScoreToLevel(score) {
    if (!score) {
      return 0
    } else if (score > 4) {
      return 100
    }
    return score * 25 - 25 / 2;
  }

  render() {
    return (
      <React.Fragment>
        <div style={{textAlign: 'center'}}>
          <Typography variant="h6">
            危険度
          </Typography>
          <ReactD3Gauge
            needleColor={theme.palette.primary.dark}
            colors={['green', 'yellow', 'orange', 'red']}
            percent={this.convertScoreToLevel(this.props.score)}
          />
        </div>
      </React.Fragment>
    );
  }
}
