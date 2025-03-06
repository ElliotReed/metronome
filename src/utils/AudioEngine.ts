//  File: AudioEngine.ts
// This class handles the audio  (and the clock, oops) for the metronome.
//  It creates an AudioContext and a master volume,  default sound volume and the accent sound volume.
//   It also contains methods to load and play audio files for the default sound and accent sound, The class also contains  a timer worker that sends messages to the main thread at a specified interval. 

export default class AudioEngine {
    private static instance: AudioEngine;
    private audioContext: AudioContext;
    public masterGain: GainNode;
    private defaultSoundGain: GainNode;
    private accentSoundGain: GainNode;
    private defaultSoundBuffer: AudioBuffer | null = null;
    private accentSoundBuffer: AudioBuffer | null = null;
    private rampTimeMinimum: number = 0.05;

    private timerWorker: Worker;
    private timerLookAhead = 0.25;

    constructor() {
        this.audioContext = new AudioContext();

        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);

        this.defaultSoundGain = this.audioContext.createGain();
        this.defaultSoundGain.gain.setValueAtTime(
            0, this.audioContext.currentTime
        );
        this.accentSoundGain = this.audioContext.createGain();
        this.accentSoundGain.gain.setValueAtTime(
            0, this.audioContext.currentTime
        );

        this.defaultSoundGain.connect(this.masterGain);
        this.accentSoundGain.connect(this.masterGain);

        this.masterGain.connect(this.audioContext.destination);


        this.timerWorker = new Worker(new URL('./timerWorker.ts', import.meta.url),
            { type: 'module' }
        );
        // console.log('AudioEngine initialized');
    }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
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

    setDefaultSoundVolume(volume: number) {
        this.defaultSoundGain.gain.linearRampToValueAtTime(
            volume, this.audioContext.currentTime + this.rampTimeMinimum
        );
    }

    setAccentSoundVolume(volume: number) {
        this.accentSoundGain.gain.linearRampToValueAtTime(
            volume, this.audioContext.currentTime + this.rampTimeMinimum
        );
    }

    playDefaultSound() {
        if (this.defaultSoundBuffer) {
            this.playSound(this.defaultSoundBuffer, this.defaultSoundGain);
        }
    }

    playAccentSound() {
        if (this.accentSoundBuffer) {
            this.playSound(this.accentSoundBuffer, this.accentSoundGain);
        }
    }

    loadDefaultSound(url: string) {
        this.loadAudioFile(url).then((buffer) => {
            this.defaultSoundBuffer = buffer;
        });
    }

    loadAccentSound(url: string) {
        this.loadAudioFile(url).then((buffer) => {
            this.accentSoundBuffer = buffer;
        });
    }

    private async loadAudioFile(url: string): Promise<AudioBuffer> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const decodedBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        return decodedBuffer;
    }

    private playSound(buffer: AudioBuffer, gain: GainNode) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(gain);
        source.start();
    }
}
