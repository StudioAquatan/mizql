import React, {Component} from 'react';
import {
  Button,
  Grid,
  Paper,
  Typography
} from '@material-ui/core';
import {KeyboardArrowDown} from '@material-ui/icons';
import {BarChart, Bar, ResponsiveContainer} from 'recharts';
import * as mockdata from '../config/mockdata';

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
        <Button color="inherit" onClick={() => this.props.pickShelter(null)}>
          <KeyboardArrowDown/>
        </Button>
        <Grid container justify="center" style={{padding: "10px"}}>
          <Grid item xs={12} lg={6} xl={6}>
            <Paper style={{padding: "20px", margin: "5px"}}>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={mockdata.evacuees}>
                  <Bar dataKey="num" fill="#8884d8"/>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6} xl={6}>
            <Paper style={{padding: "20px", margin: "5px", height: '300px'}}>
              <Typography variant="h5">{this.state.shelter.name}</Typography>
              <Typography>{this.state.shelter.distance} m</Typography>
              <Typography>{this.state.shelter.address}</Typography>
              <Button
                style={{boxShadow: 'none'}}
                variant="contained"
                color="secondary"
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
