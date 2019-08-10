import React, { Component } from 'react';
import './Metronome.css';
import click1 from './click.wav';
import click2 from './clickAccent.wav';

class Metronome extends Component {
	constructor(props) {
		super(props);

		this.state = {
			playing: false,
			count: 0,
			beatsPerMeasure: 4,
			degrees: 270,
			evenbeat: false,
			accent: false,
		};

		this.click1 = new Audio(click1);
		this.click2 = new Audio(click2);
	}

	swingPendulum = clickLength => {
		const initialPosition = this.state.degrees;
		const centerDegrees = 270;
		const swingAmount = 45;
		const fps = clickLength / 1000 / 60;
		let degreesPerMove = swingAmount * 2 * fps;
		let interval =
			(clickLength / (swingAmount * 2)) * Math.abs(degreesPerMove);

		if (initialPosition === centerDegrees) {
			degreesPerMove = swingAmount * fps;
			interval = (clickLength / swingAmount) * Math.abs(degreesPerMove);
		}
		if (initialPosition > centerDegrees) {
			degreesPerMove = -Math.abs(degreesPerMove);
		}

		if (this.animationTimer) {
			clearInterval(this.animationTimer);
		}

		this.animationTimer = setInterval(() => {
			if (
				!this.state.playing &&
				(Math.floor(this.state.degrees) === centerDegrees ||
					Math.ceil(this.state.degrees) === centerDegrees)
			) {
				clearInterval(this.animationTimer);
				this.setState({ degrees: centerDegrees });
			} else {
				this.setState(prevState => {
					return {
						degrees: prevState.degrees + degreesPerMove,
					};
				});
			}
		}, interval);

		this.setState(prevState => {
			return {
				degrees: prevState.degrees + degreesPerMove,
			};
		});
	};

	startStop = () => {
		const clickLength = (60 / this.props.bpm) * 1000;
		if (this.state.playing) {
			// Stop the timer
			clearInterval(this.timer);
			this.setState({
				playing: false,
			});
			this.swingPendulum(clickLength);
		} else {
			// Start a timer with the current BPM
			this.timer = setInterval(() => {
				this.playClick();
				this.swingPendulum(clickLength);
			}, clickLength);

			this.setState(
				{
					count: 0,
					playing: true,
				},
				() => {
					this.playClick();
					this.swingPendulum(clickLength);
				}
			);
		}
	};

	playClick = () => {
		const { count, beatsPerMeasure, accent, evenbeat } = this.state;

		// The first beat will have a different sound than the others
		if (count % beatsPerMeasure === 0 && accent && !evenbeat) {
			this.click2.play();
		} else if (count % 2 === 0 && evenbeat) {
			this.click1.play();
		} else if (!evenbeat) {
			this.click1.play();
		}

		// Track the beat
		this.setState(state => ({
			count: (state.count + 1) % state.beatsPerMeasure,
		}));
	};

	handleBpmChange = event => {
		const bpm = event.target.value;

		if (this.state.playing) {
			// Stop old timer and start a new one
			clearInterval(this.timer);
			this.timer = setInterval(this.playClick, (60 / bpm) * 1000);
			this.props.setBpm(bpm);

			this.setState({
				count: 0,
			});
		} else {
			this.props.setBpm(bpm);
		}
	};

	handleCheckboxChange = event => {
		let { name } = event.target;

		this.setState(prevState => {
			return {
				[name]: !prevState[name],
			};
		});
	};

	render() {
		const { playing, degrees, accent, evenbeat } = this.state;
		const { bpm } = this.props;

		let swingAnimation = {
			transform: `rotateZ(${degrees}deg)`,
		};

		return (
			<div className="metronome">
				<div className="metronome__body">
					<div className="metronome__body-faceplate" />
					<div className="pendulum" style={swingAnimation}>
						<div className="pendulum__bottom">
							<div className="pendulum__weight" />
						</div>
						<input
							tabIndex="0"
							className="pendulum__top"
							type="range"
							min="40"
							max="320"
							value={bpm}
							onChange={this.handleBpmChange}
						/>
					</div>
				</div>
				<div className="metronome__controls">
					<div className="bpm-display">{bpm} BPM</div>
					<button onClick={this.startStop}>
						{playing ? 'Stop' : 'Start'}
					</button>
					<form>
						<div className="checkgroup">
							<label htmlFor="accent">
								<input
									type="checkbox"
									id="accent"
									name="accent"
									value={accent}
									onChange={this.handleCheckboxChange}
								/>
								Accent beat 1?
							</label>
						</div>
						<div className="checkgroup">
							<label htmlFor="evenbeat">
								<input
									type="checkbox"
									id="evenbeat"
									name="evenbeat"
									value={evenbeat}
									onChange={this.handleCheckboxChange}
								/>
								2 and 4 only?
							</label>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default Metronome;
