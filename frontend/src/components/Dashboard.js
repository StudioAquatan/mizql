import React, {Component} from 'react';
import {
  Grid,
  Paper,
  Tabs, Tab
} from '@material-ui/core';
import * as mockdata from '../config/mockdata';
import * as auth from '../modules/auth';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    }
  }

  handleTabChange(e, v) {
    this.setState({tab: v});
  }

  render() {
    return (
      <Paper>
        <Paper square style={{boxShadow: 'none', borderBottom: '1px solid #e8e8e8'}}>
          <Tabs
            value={this.state.tab}
            onChange={this.handleTabChange.bind(this)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="現在地情報"/>
            <Tab label="友人の避難状況" disabled={!auth.isLogin()}/>
          </Tabs>
        </Paper>

        {this.state.tab === 0 &&
        <Grid container justify='center'>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <p>現在地情報</p>
            <p>住所?</p>
            {mockdata.area.alarms.map((alarm, key) => (
              <React.Fragment key={key}>
                <p>{alarm.name} : {alarm.created_at}</p>
              </React.Fragment>
            ))}
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <p>危険度</p>
            <p>TODO: 何かのグラフ</p>
          </Grid>
        </Grid>
        }

        {this.state.tab === 1 &&
        <React.Fragment>
          <p>友人の避難状況</p>
        </React.Fragment>
        }
      </Paper>
    )
  }
}