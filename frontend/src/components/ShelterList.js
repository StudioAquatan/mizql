import React, {Component} from 'react';
import {
  Paper,
  Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TableFooter
} from '@material-ui/core';


export default class ShelterList extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: 0,
    };
  }

  handleChangePage(e, p) {
    this.setState({page: p});
  }

  render(){
    if(!this.props.shelters){
      console.log(("no shelters"));
      return null
    }
    return(
      <Paper style={{
        height: '100%',
        width: '100%',
        overflowX: 'auto',
      }}>
        <Table style={{minWidth: 300}}>
          <TableHead>
            <TableRow>
              <TableCell>避難所名</TableCell>
              <TableCell numeric>距離 [m]</TableCell>
              {/*<TableCell>住所</TableCell>*/}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.shelters.slice(this.state.page * 10, this.state.page * 10 + 10).map((shelter, key) => (
              <TableRow
                key={key}
                hover
                onClick={(e) => this.props.pickShelter(shelter)}
              >
                <TableCell>{shelter.name}</TableCell>
                <TableCell numeric>{shelter.distance} m</TableCell>
                {/*<TableCell>{shelter.address}</TableCell>*/}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={this.props.shelters.length}
                onChangePage={this.handleChangePage.bind(this)}
                page={this.state.page}
                rowsPerPage={10}
                rowsPerPageOptions={[10]}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
  }
}

