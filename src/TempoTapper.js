import React, { Component } from 'react';
import './TempoTapper.css';

export const calculteBeatsPerMinute = taps => {
	const length = taps.length;
	if (length === 1) {
		return 'keep tapping!';
	} else {
		const totalTime = taps[length - 1] - taps[0];
		const seconds = totalTime / 1000;
		const beat = seconds / length;
		const bpm = Math.floor(60 / beat);

		return bpm;
	}
};

export default class TempoTapper extends Component {
	constructor(props) {
		super(props);

		this.state = {
			taps: [],
			tempo: 'tap button to start',
		};
	}

	handleTempoTap = () => {
		const now = new Date();
		const taps = this.state.taps;
		taps.push(now);

		if (taps.length > 6) {
			taps.shift();
		}

		const tempo = calculteBeatsPerMinute(taps);
		this.setState({ tempo });
	};

	render() {
		const { tempo } = this.state;
		return (
			<div className="tempo-tapper">
				<h2>Tempo Tapper</h2>
				<button className="tap__button" onClick={this.handleTempoTap}>Tap</button>
				<h4>Tempo</h4>
				<p>{tempo}</p>
				<button className="tap__set-bpm" onClick={() => this.props.setBpm(tempo)}>Set BPM</button>
			</div>
		);
	}
}
