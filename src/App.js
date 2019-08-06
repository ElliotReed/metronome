import React, { Component } from 'react';
import './App.css';
import Metronome from './Metronome';
import TempoTapper from './TempoTapper';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Metronome</h1>
        </header>
        <Metronome />
        <TempoTapper />
      </div>
    );
  }
}

export default App;
