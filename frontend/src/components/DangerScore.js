import React, {Component} from 'react';
import {Grid} from '@material-ui/core';
import theme from '../config/theme';
import ReactSpeedometer from 'react-d3-speedometer';
import LiquidFillGauge from 'react-liquid-gauge';
import {interpolateRgb} from 'd3-interpolate';
import { color } from 'd3-color';

export default class DangerScore extends Component {
  normalizeLevel = (score) => {
    if (!score) {
      return 0
    } else if (score > 5) {
      return 5
    }
    return score;
  };

  convertLevel = (score) => {
    score = this.normalizeLevel(score);
    return 20 * score;
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
        return "激ヤバ";
      default:
        return "";
    }
  };

  render() {
    const value = this.convertLevel(this.props.level);
    const startColor = theme.dashboard.dangerMeter.startColor; // cornflowerblue
    const endColor = theme.dashboard.dangerMeter.endColor; // crimson
    const interpolate = interpolateRgb(startColor, endColor);
    const fillColor = interpolate(value / 100);
    const gradientStops = [
      {
        key: '0%',
        stopColor: color(fillColor).darker(0.5).toString(),
        stopOpacity: 1,
        offset: '0%'
      },
      {
        key: '50%',
        stopColor: fillColor,
        stopOpacity: 0.75,
        offset: '50%'
      },
      {
        key: '100%',
        stopColor: color(fillColor).brighter(0.5).toString(),
        stopOpacity: 0.5,
        offset: '100%'
      }
    ];

    return (
      <Grid item xs={12} md={4} lg={4} xl={4}>
        <LiquidFillGauge
          style={{margin: 'auto'}}
          height={250}
          width={250}
          value={value}
          percent="%"
          textSize={1}
          textOffsetX={0}
          textOffsetY={0}
          textRenderer={({value, width, height, textSize, percent}) => {
            value = Math.round(value);
            const radius = Math.min(height / 2, width / 2);
            const textPixels = (textSize * radius / 3);
            const valueStyle = {
              fontSize: textPixels
            };
            const percentStyle = {
              fontSize: textPixels * 0.6
            };
            return (
              <tspan>
                <tspan className="value" style={valueStyle}>{this.getDisplayMessage(this.props.level)}</tspan>
              </tspan>
            );
          }}
          waveAnimation
          waveFrequency={2}
          waveAmplitude={1}
          gradient
          gradientStops={gradientStops}
          circleStyle={{
            fill: fillColor
          }}
          waveStyle={{
            fill: fillColor
          }}
          textStyle={{
            fill: color('#444').toString(),
            fontFamily: 'Arial'
          }}
          waveTextStyle={{
            fill: color('#fff').toString(),
            fontFamily: 'Arial'
          }}
        />
      </Grid>
    );
  }
}
