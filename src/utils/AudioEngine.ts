import { isNull } from 'util';
import { MidiNote } from '../data/midiNote';

const CLICK_URL = '/click.wav';

class AudioEngine {
    private audioContext: AudioContext;
    public masterGain: GainNode;
    private envelopeNode: GainNode;
    private metronomeGain: GainNode;
    private oscillatorNode: OscillatorNode | null = null;
    private toneGain: GainNode;
    private clickBuffer: AudioBuffer | null = null;
    private clickSource: AudioBufferSourceNode | null = null;
    private rampTimeMinimum: number = 0.05;

    private timerWorker: Worker;
    private timerLookAhead = 0.25;

    constructor() {
        this.audioContext = new AudioContext();
        this.envelopeNode = this.audioContext.createGain();

        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);

        this.metronomeGain = this.audioContext.createGain();
        this.metronomeGain.gain.setValueAtTime(
            0, this.audioContext.currentTime
        );

        this.toneGain = this.audioContext.createGain();
        this.toneGain.gain.setValueAtTime(0, this.audioContext.currentTime);

        this.envelopeNode.connect(this.toneGain);
        this.metronomeGain.connect(this.masterGain);
        this.toneGain.connect(this.masterGain);

        this.masterGain.connect(this.audioContext.destination);

        this.loadAudioFile(CLICK_URL)
            .catch(console.error);

        this.timerWorker = new Worker(new URL('./timerWorker.ts', import.meta.url),
            { type: 'module' }
        );
    }

    connectToEnvelopeNode(node: AudioNode) {
        node.connect(this.envelopeNode);
    }

    // connectToToneGain(node: AudioNode) {
    //     console.log('constructed');
    //     node.connect(this.toneGain);
    // }

    createToneOscillator(
        frequency: number,
        loudnessAdjustment: number = 1,
        startTime?: number,
        stopTime?: number,
    ): {
        toneOscillator: OscillatorNode,
        startTone: (startTime: number) => void,
        stopTone: (stopTime: number) => void,
    } {

        const toneOscillator = this.audioContext.createOscillator();
        toneOscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        this.connectToEnvelopeNode(toneOscillator);
        ///////////////////////
        let attack = 0.05;
        let release = 0.05;
        const releaseOffset = release / 2;

        const startTone = (startTime: number) => {
            this.envelopeNode?.gain
                .setValueAtTime(0, startTime)
                .linearRampToValueAtTime(
                    1 * loudnessAdjustment,
                    startTime + attack
                )
            toneOscillator.start(startTime);
        }

        const stopTone = (stopTime: number) => {
            if (stopTime === this.audioContext.currentTime) {
                this.envelopeNode.gain
                    .linearRampToValueAtTime(
                        1 * loudnessAdjustment,
                        stopTime
                    )
                    .linearRampToValueAtTime(
                        0,
                        stopTime + releaseOffset
                    )
                toneOscillator.stop(stopTime + release);
            }


            this.envelopeNode.gain
                .linearRampToValueAtTime(
                    1 * loudnessAdjustment,
                    stopTime - release
                )
                .linearRampToValueAtTime(
                    0,
                    stopTime - releaseOffset
                )
            toneOscillator.stop(stopTime);
        }

        toneOscillator.onended = () => toneOscillator.disconnect();

        if (startTime !== undefined) {
            startTone(startTime);
            if (stopTime !== undefined) {
                stopTone(stopTime);
            }
        }

        return {
            toneOscillator,
            startTone,
            stopTone,
        };
    }

    play(midiNote: MidiNote, startTime: number, duration: number) {
        const currentTime = this.audioContext.currentTime;
        console.log('midiNote: ', midiNote);
        if (startTime < 0 || duration <= 0) {
            throw new Error("startTime and duration must be positive numbers.");
        }

        if (this.audioContext.state === "suspended") {
            this.audioContext.resume()
        }

        this.createOscillatorNode(midiNote.frequency);

        if (this.oscillatorNode) {
            this.oscillatorNode.start(currentTime + startTime)
            this.oscillatorNode.stop(currentTime + startTime + duration);
            this.setEnvelope(startTime, duration, midiNote);
        }
    }

    stop() {
        this.oscillatorNode?.stop(0);
    }

    startTimer() {
        this.timerWorker.postMessage({ 'interval': this.timerLookAhead });
    }

    setTimerOnMessageFunction(onMessageFunction: () => void) {
        this.timerWorker.onmessage = function () {
            onMessageFunction();
        }
    }

    stopTimer() {
        this.timerWorker.postMessage('stop');
    }

    setMasterVolume(volume: number) {
        const currentTime = this.audioContext.currentTime;

        this.masterGain.gain.cancelScheduledValues(currentTime);

        // this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, currentTime);

        this.masterGain.gain.linearRampToValueAtTime(
            volume, currentTime + this.rampTimeMinimum
        );
    }

    setMetronomeVolume(volume: number) {
        this.metronomeGain.gain.linearRampToValueAtTime(
            volume, this.audioContext.currentTime + this.rampTimeMinimum
        );
    }

    setToneVolume(volume: number) {
        this.toneGain.gain.linearRampToValueAtTime(
            volume, this.audioContext.currentTime + this.rampTimeMinimum
        );
    }

    // temp to bridge vibrato refactor
    getAudioContext() {
        return this.audioContext;
    }
    // temp to 
    playClick(time: number) {
        this.createClickSource();
        this.clickSource?.start(time);
    }
    // temp to test
    getCurrentTime(): number {
        return this.audioContext.currentTime;
    }

    private async loadAudioFile(url: string): Promise<void> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.clickBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.createClickSource();
    }

    private createClickSource(): void {
        if (this.clickBuffer) {
            this.clickSource = this.audioContext.createBufferSource();
            this.clickSource.buffer = this.clickBuffer;
            this.clickSource.connect(this.metronomeGain);
        } else {
            console.error('Click buffer is not loaded');
        }
    }

    private cleanupOscillator() {
        if (this.oscillatorNode) {
            this.oscillatorNode.disconnect();
            this.oscillatorNode = null;
        }
    }

    private createOscillatorNode(frequency: number) {
        this.oscillatorNode = this.audioContext.createOscillator();
        this.oscillatorNode.frequency.value = frequency;
        this.oscillatorNode.connect(this.envelopeNode);
        this.oscillatorNode.onended = () => this.cleanupOscillator();
    }

    private setEnvelope(
        startTime: number, duration: number, midiNote: MidiNote
    ) {
        let attack = 0.05;
        let release = 0.05;
        const currentTime = this.audioContext.currentTime;
        const releaseOffset = release / 2;

        this.envelopeNode?.gain
            .setValueAtTime(0, currentTime + startTime)
            .linearRampToValueAtTime(
                midiNote.loudnessAdjustment,
                currentTime + startTime + attack
            )
            .linearRampToValueAtTime(
                midiNote.loudnessAdjustment,
                currentTime + startTime + duration - release
            )
            .linearRampToValueAtTime(
                0,
                currentTime + startTime + duration - releaseOffset
            )
    }

}

export default AudioEngine;