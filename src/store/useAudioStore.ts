import { create } from 'zustand';
import { persist } from 'zustand/middleware'

export type defaultSound = 'drumstick' | 'hihat' | 'kick' | 'snare';
export type accentSound = 'drumstick-accent' | 'hihat-accent' | 'kick-accent' | 'snare-accent';

export type AudioSettings = {
    masterVolume: number;
    setMasterVolume: (volume: number) => void;
    defaultSoundVolume: number;
    setDefaultSoundVolume: (volume: number) => void;
    accentSoundVolume: number;
    setAccentSoundVolume: (volume: number) => void;
    defaultSound: defaultSound;
    setDefaultSound: (sound: defaultSound) => void;
    accentSound: accentSound;
    setAccentSound: (sound: accentSound) => void;
}

const useAudioStore = create<AudioSettings>()(persist(
    (set) => ({
        masterVolume: 0.5,
        setMasterVolume: (volume: number) => set({ masterVolume: volume }),
        defaultSoundVolume: 0.5,
        setDefaultSoundVolume: (volume: number) => set({ defaultSoundVolume: volume }),
        accentSoundVolume: 0.5,
        setAccentSoundVolume: (volume: number) => set({ accentSoundVolume: volume }),
        defaultSound: 'drumstick',
        setDefaultSound: (sound: defaultSound) => set({ defaultSound: sound }),
        accentSound: 'drumstick-accent',
        setAccentSound: (sound: accentSound) => set({ accentSound: sound }),
    }),
    { name: 'cm-audio-settings' }
));

export default useAudioStore;