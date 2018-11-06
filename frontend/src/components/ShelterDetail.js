import React, {Component} from 'react';

export default class ShelterDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shelter: props.shelter,
    };
  }

  render(){
    return (
      <React.Fragment>
        <p>避難所詳細情報</p>
        <p>{this.state.shelter.name}</p>
        <p>{this.state.shelter.distance}</p>
        <p>{this.state.shelter.address}</p>
        <button onClick={() => this.props.pickShelter(null)}>戻る</button>
      </React.Fragment>
    );
  }
}
