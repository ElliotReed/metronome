import React, { createContext, useContext } from "react";
import AudioEngine from '@/utils/AudioEngine';

const AudioEngineContext = createContext<AudioEngine | null>(null);

export const AudioEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const audioEngine = AudioEngine.getInstance();

    return (
        <AudioEngineContext.Provider value={audioEngine}>
            {children}
        </AudioEngineContext.Provider>
    );
};

export const useAudioEngine = () => {
    const context = useContext(AudioEngineContext);
    if (!context) {
        throw new Error("useAudioEngine must be used within an AudioEngineProvider");
    }
    return context;
};
