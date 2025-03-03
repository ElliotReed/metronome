import * as React from 'react';

import AudioEngine from '../utils/AudioEngine';

const AudioContext = React.createContext<AudioEngine | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> =
    ({ children }) => {
        const audioEngine = new AudioEngine();

        return (
            <AudioContext.Provider value={audioEngine}>
                {children}
            </AudioContext.Provider>
        );
    };

export const useAudioEngine = () => {
    const context = React.useContext(AudioContext);

    if (!context) {
        throw new Error("use Audio must be used within an AudioProvider");
    }

    return context;
}