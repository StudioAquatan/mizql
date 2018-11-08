import React, {Component} from 'react';
import {
  Grid,
  Paper,
  Tabs, Tab,
  List, ListItem, ListItemIcon, ListItemText, ListSubheader,
  Table, TableBody, TableCell, TableHead, TableFooter, TableSortLabel, TablePagination, TableRow
} from '@material-ui/core';
import * as icons from '@material-ui/icons';
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
      <Paper style={{width: '100%', overflowX: 'auto'}}>
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
            <List
              subheader={<ListSubheader component="div">発令中の警報・注意報</ListSubheader>}
            >
              {mockdata.area.alarms.map((alarm, key) => (
                <ListItem key={key}>
                  {alarm.type === 0 && <ListItemIcon>
                    <icons.Warning style={{color: "#D7DF01"}}/>
                  </ListItemIcon>}
                  {alarm.type === 1 && <ListItemIcon>
                    <icons.Error style={{color: "#DF0101"}}/>
                  </ListItemIcon>}
                  <ListItemText primary={alarm.name}/>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <p>危険度</p>
            <p>TODO: 何かのグラフ</p>
          </Grid>
        </Grid>
        }

        {this.state.tab === 1 &&
        <div style={{padding: '10px'}}>
          <Table style={{minWidth: 500}}>
            <TableHead>
              <TableRow>
                <TableCell>名前</TableCell>
                <TableCell>避難状況</TableCell>
                <TableCell>避難先</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockdata.friends.map((friend, key) => (
                <TableRow key={key}>
                  <TableCell>{friend.username}</TableCell>
                  <TableCell>{friend.refuged ? "避難済み" : "-"}</TableCell>
                  <TableCell onClick={(e) => this.props.pickShelter(friend.shelter)}>{friend.refuged ? friend.shelter.name : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        }
      </Paper>
    )
  }
}