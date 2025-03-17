import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TrainerData {
    points: number;
    incrementPoints: (numberOfPointsToIncrement: number) => void;
    decrementPoints: (numberOfPointsToDecrement: number) => void;
}

export const useTempoTrainerStore = create<TrainerData>()(persist(
    (set, get) => ({
        points: 0,
        incrementPoints: (numberOfPointsToIncrement: number) => {
            set(state => ({
                points: state.points + numberOfPointsToIncrement
            }));
        },
        decrementPoints: (numberOfPointsToDecrement: number) => {
            set(state => {
                const suggestedNewPoints = state.points - numberOfPointsToDecrement;
                return {
                    points: suggestedNewPoints > 0 ? suggestedNewPoints : 0
                };
            });
        },

    }),
    { name: 'cm-tempo-trainer' }
));