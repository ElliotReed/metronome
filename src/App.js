import React, { useState } from 'react';
import './App.css';
import Metronome from './Metronome';
import TempoTapper from './TempoTapper';

const App = () => {
	const [bpm, setBpm] = useState(100);

	return (
		<>
			<header className="header">
				<h1 className="title">Metronome</h1>
			</header>
			<Metronome bpm={bpm} setBpm={setBpm} />
			<TempoTapper setBpm={setBpm} />
		</>
	);
};

export default App;
