import React, { Component } from 'react';
import './Metronome.css';
import click1 from './click1.wav';
import click2 from './click2.wav';

class TempoTapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      taps: [],
    }
  }

  render() {
    return (
      'Tempo Tapper'
    )
  }
}

export default TempoTapper;