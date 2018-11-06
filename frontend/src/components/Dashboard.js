import React, {Component} from 'react';
import {
  Grid,
  Paper,
  Tabs, Tab,
  Table, TableBody, TableCell, TableHead, TableFooter, TableSortLabel, TablePagination, TableRow
} from '@material-ui/core';
import * as mockdata from '../config/mockdata';
import * as auth from '../modules/auth';
import * as util from '../modules/util';

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
        <Grid container justify='center' style={{padding: 10}}>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <Table style={{minWidth: 600}}>
              <TableHead>
                <TableRow>
                  <TableCell>発令事項</TableCell>
                  <TableCell>発令時間</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockdata.area.alarms.map((alarm, key) => (
                  <TableRow key={key}>
                    <TableCell>{alarm.name}</TableCell>
                    <TableCell>{util.parseDateStr(alarm.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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