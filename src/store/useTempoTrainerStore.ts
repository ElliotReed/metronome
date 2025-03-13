import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TrainerData = {
    wins: number;
    incrementWins: () => void;
    losses: number;
    incrementLosses: () => void;
    level: number;
    incrementLevel: () => void;
    decrementLevel: () => void;
    getLevelString: () => string;
}

export const useTempoTrainerStore = create<TrainerData>()(persist(
    (set, get) => ({
        wins: 0,
        incrementWins: () => set((state) => ({ wins: state.wins + 1 })),
        losses: 0,
        incrementLosses: () => set((state) => ({ losses: state.losses + 1 })),
        level: 1,
        incrementLevel: () => set((state) => ({ level: state.level + 1 })),
        decrementLevel: () => set((state) => ({ level: state.level - 1 })),
        getLevelString: () => {
            const level = get().level;
            switch (level) {
                case 1: return 'Beginner';
                case 2: return 'Intermediate';
                case 3: return 'Advanced';
                default: return 'Unrecognized level';
            }
        }
    }),
    { name: 'cm-tempo-trainer' }
));