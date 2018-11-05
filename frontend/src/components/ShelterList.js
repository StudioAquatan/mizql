import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


export default class ShelterList extends Component {

  handleShelterClick(e, shelter) {
    console.log(`clicked ${shelter.name}`);
  }

  render(){
    if(!this.props.shelters){
      console.log(("no shelters"));
      return null
    }
    return(
      <Paper style={{
        width: '100%',
        overflowX: 'auto',
      }}>
        <Table style={{minWidth: 700}}>
          <TableHead>
            <TableRow>
              <TableCell>避難所名</TableCell>
              <TableCell numeric>距離 [m]</TableCell>
              <TableCell>住所</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.shelters.map((shelter, key) => (
              <TableRow
                key={key}
                hover
                onClick={(e) => this.handleShelterClick(e, shelter)}
              >
                <TableCell>{shelter.name}</TableCell>
                <TableCell numeric>{shelter.distance} m</TableCell>
                <TableCell>{shelter.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

