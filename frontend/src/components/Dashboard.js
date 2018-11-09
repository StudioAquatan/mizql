import React, {Component} from 'react';
import {
  Grid,
  Paper,
  Tabs, Tab,
  List, ListItem, ListItemIcon, ListItemText, ListSubheader,
  Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TableFooter
} from '@material-ui/core';
import theme from '../config/theme';
import * as icons from '@material-ui/icons';
// import * as mockdata from '../config/mockdata';
import * as auth from '../modules/auth';
import Precipitation from './Precipitation';
import DangerScore from './DangerScore';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      friendPage: 0,
    };
  }

  handleTabChange(e, v) {
    this.setState({tab: v});
  }

  handleChangePage(e, p) {
    this.setState({friendPage: p});
  }

  render() {
    return (
      <Paper style={{width: '100%', overflowX: 'auto', minHeight: '300px'}}>
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

        {/* Tab1 */}
        {this.state.tab === 0 &&
        <Grid container justify='center' alignItems='center' direction='row' style={{padding: 10}} spacing={16}>
          {this.props.canUseLocation ?
            <React.Fragment>
              <Grid item xs={12} md={3} lg={3} xl={3}>
                <List subheader={<ListSubheader component="div">発令中の警報・注意報</ListSubheader>}>
                  {this.props.area.alarms.map((alarm, key) => (
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

              <Precipitation rain={this.props.area.rain}/>

              <DangerScore level={this.props.area.level}/>
            </React.Fragment>
            :
            <p>現在地情報を使用できません</p>
          }
        </Grid>
        }

        {/* Tab2 */}
        {this.state.tab === 1 && this.props.userInfo &&
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
              {this.props.userInfo.follows.slice(this.state.friendPage * theme.friendList.rowPerPage, this.state.friendPage * theme.friendList.rowPerPage + theme.friendList.rowPerPage).map((friend, key) => (
                <TableRow key={key}>
                  <TableCell>{friend.username}</TableCell>
                  <TableCell>{friend.refuged ? "避難済み" : "-"}</TableCell>
                  <TableCell
                    onClick={(e) => this.props.pickShelter(friend.shelter)}>{friend.refuged ? friend.shelter.name : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={this.props.userInfo.follows.length}
                  onChangePage={this.handleChangePage.bind(this)}
                  page={this.state.friendPage}
                  rowsPerPage={5}
                  rowsPerPageOptions={[5]}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        }
      </Paper>
    )
  }
}