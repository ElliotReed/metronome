import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MetronomeSettings = {
    bpm: number;
    setBpm: (bpm: number) => void;
    incrementBpm: () => void;
    decrementBpm: () => void;
    beatsPerMeasure: number;
    setBeatsPerMeasure: (beats: number) => void;
    beatValue: number;
    setBeatValue: (value: number) => void;
    beatCount: number;
    incrementBeatCount: () => void;
    resetBeatCount: () => void;
}

export const useMetronomeStore = create<MetronomeSettings>()(
    persist(
        (set) => ({
            bpm: 120,
            setBpm: (bpm: number) => set({ bpm }),
            incrementBpm: () => set((state) => ({ bpm: state.bpm + 1 })),
            decrementBpm: () => set((state) => ({ bpm: state.bpm - 1 })),
            beatsPerMeasure: 4,
            setBeatsPerMeasure: (beats: number) => set({ beatsPerMeasure: beats }),
            beatValue: 4,
            setBeatValue: (value: number) => set({ beatValue: value }),
            beatCount: 0,
            incrementBeatCount: () => set((state) => ({ beatCount: state.beatCount < state.beatsPerMeasure ? state.beatCount + 1 : 1 })),
            resetBeatCount: () => set({ beatCount: 0 })
        }),
        { name: 'cm-metronome-settings' }
    )
);
