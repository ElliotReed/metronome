import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DefaultSound = 'drumstick' | 'hihat' | 'kick' | 'snare';
export type AccentSound = 'drumstick-accent' | 'hihat-accent' | 'kick-accent' | 'snare-accent';

interface AudioState {
    // Settings
    masterVolume: number;
    defaultSoundVolume: number;
    accentSoundVolume: number;
    defaultSound: DefaultSound;
    accentSound: AccentSound;

    // Actions - Settings
    setMasterVolume: (volume: number) => void;
    setDefaultSoundVolume: (volume: number) => void;
    setAccentSoundVolume: (volume: number) => void;
    setDefaultSound: (sound: DefaultSound) => void;
    setAccentSound: (sound: AccentSound) => void;

    // Audio Engine state
    audioContext: AudioContext | null;
    masterGain: GainNode | null;
    defaultSoundGain: GainNode | null;
    accentSoundGain: GainNode | null;
    defaultSoundBuffer: AudioBuffer | null;
    accentSoundBuffer: AudioBuffer | null;
    rampTimeMinimum: number;

    // Audio Engine actions
    initializeAudio: () => void;
    playDefaultSound: () => void;
    playAccentSound: () => void;
    loadDefaultSound: (url: string) => Promise<void>;
    loadAccentSound: (url: string) => Promise<void>;
}

export const useAudioStore = create<AudioState>()(
    persist(
        (set, get) => ({
            // Persisted settings
            masterVolume: 0.5,
            defaultSoundVolume: 0.5,
            accentSoundVolume: 0.5,
            defaultSound: 'drumstick',
            accentSound: 'drumstick-accent',

            // Engine state - not persisted
            audioContext: null,
            masterGain: null,
            defaultSoundGain: null,
            accentSoundGain: null,
            defaultSoundBuffer: null,
            accentSoundBuffer: null,
            rampTimeMinimum: 0.05,

            // Actions
            setMasterVolume: (volume: number) => {
                set({ masterVolume: volume });
                const state = get();
                if (state.audioContext && state.masterGain) {
                    const currentTime = state.audioContext.currentTime;
                    state.masterGain.gain.cancelScheduledValues(currentTime);
                    state.masterGain.gain.linearRampToValueAtTime(
                        volume,
                        currentTime + state.rampTimeMinimum
                    );
                }
            },

            setDefaultSoundVolume: (volume: number) => {
                set({ defaultSoundVolume: volume });
                const state = get();
                if (state.audioContext && state.defaultSoundGain) {
                    state.defaultSoundGain.gain.linearRampToValueAtTime(
                        volume,
                        state.audioContext.currentTime + state.rampTimeMinimum
                    );
                }
            },

            setAccentSoundVolume: (volume: number) => {
                set({ accentSoundVolume: volume });
                const state = get();
                if (state.audioContext && state.accentSoundGain) {
                    state.accentSoundGain.gain.linearRampToValueAtTime(
                        volume,
                        state.audioContext.currentTime + state.rampTimeMinimum
                    );
                }
            },

            setDefaultSound: (sound: DefaultSound) => {
                set({ defaultSound: sound });
            },

            setAccentSound: (sound: AccentSound) => {
                set({ accentSound: sound });
            },

            initializeAudio: () => {
                // Create audio context if not already created
                const state = get();
                if (state.audioContext) return;

                try {
                    const audioContext = new AudioContext();

                    // Create and connect gain nodes
                    const masterGain = audioContext.createGain();
                    masterGain.gain.setValueAtTime(state.masterVolume, audioContext.currentTime);

                    const defaultSoundGain = audioContext.createGain();
                    defaultSoundGain.gain.setValueAtTime(state.defaultSoundVolume, audioContext.currentTime);

                    const accentSoundGain = audioContext.createGain();
                    accentSoundGain.gain.setValueAtTime(state.accentSoundVolume, audioContext.currentTime);

                    // Connect the gain nodes
                    defaultSoundGain.connect(masterGain);
                    accentSoundGain.connect(masterGain);
                    masterGain.connect(audioContext.destination);

                    set({
                        audioContext,
                        masterGain,
                        defaultSoundGain,
                        accentSoundGain
                    });
                } catch (error) {
                    console.error('Failed to initialize audio context:', error);
                }
            },

            playDefaultSound: () => {
                const state = get();
                if (state.audioContext && state.defaultSoundBuffer && state.defaultSoundGain) {
                    const source = state.audioContext.createBufferSource();
                    source.buffer = state.defaultSoundBuffer;
                    source.connect(state.defaultSoundGain);
                    source.start();
                }
            },

            playAccentSound: () => {
                const state = get();
                if (state.audioContext && state.accentSoundBuffer && state.accentSoundGain) {
                    const source = state.audioContext.createBufferSource();
                    source.buffer = state.accentSoundBuffer;
                    source.connect(state.accentSoundGain);
                    source.start();
                }
            },

            loadDefaultSound: async (url: string) => {
                const state = get();
                if (!state.audioContext) {
                    get().initializeAudio();
                }

                try {
                    const audioContext = get().audioContext;
                    if (!audioContext) return;

                    const response = await fetch(url);
                    const arrayBuffer = await response.arrayBuffer();
                    const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);

                    set({ defaultSoundBuffer: decodedBuffer });
                } catch (error) {
                    console.error('Failed to load default sound:', error);
                }
            },

            loadAccentSound: async (url: string) => {
                const state = get();
                if (!state.audioContext) {
                    get().initializeAudio();
                }

                try {
                    const audioContext = get().audioContext;
                    if (!audioContext) return;

                    const response = await fetch(url);
                    const arrayBuffer = await response.arrayBuffer();
                    const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);

                    set({ accentSoundBuffer: decodedBuffer });
                } catch (error) {
                    console.error('Failed to load accent sound:', error);
                }
            }
        }),
        {
            name: 'cm-audio-settings',
            // Only persist the settings, not the AudioContext and buffers
            partialize: (state) => ({
                masterVolume: state.masterVolume,
                defaultSoundVolume: state.defaultSoundVolume,
                accentSoundVolume: state.accentSoundVolume,
                defaultSound: state.defaultSound,
                accentSound: state.accentSound,
            }),
        }
    )
);
