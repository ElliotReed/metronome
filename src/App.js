import React, { useState } from 'react';
import './App.css';
import Metronome from './Metronome';
import TempoTapper from './TempoTapper';

const App = () => {
	const [bpm, setBpm] = useState(100);

	return (
		<div className="App">
			<header className="App-header">
				<h1 className="App-title">Metronome</h1>
			</header>
			<Metronome bpm={bpm} setBpm={setBpm} />
			<TempoTapper setBpm={setBpm} />
		</div>
	);
};

export default App;
