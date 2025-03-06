import React from 'react';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import { useAudioEngine } from '@/context/AudioContext';
import createLocalStorageService from '@/services/localStorageService';

import defaultSound from "/assets/drumstick.wav";
import accentSound from "/assets/drumstick-accent.wav";

import "./App.css";

const SOUND_STORAGE_KEY = 'sound_state';

type SoundState = {
}

export default function App({ children }: { children: React.ReactNode }) {
    const audioEngine = useAudioEngine();
    const soundStateStorage = createLocalStorageService(SOUND_STORAGE_KEY);

    React.useEffect(() => {
        audioEngine.loadDefaultSound(defaultSound);
        audioEngine.loadAccentSound(accentSound);
        audioEngine.setMasterVolume(1);
        audioEngine.setDefaultSoundVolume(1);
        audioEngine.setAccentSoundVolume(1);
    }, [audioEngine]);

    return (
        <>
            <Header />
            <main className="main scrollbar">
                {children}
            </main>
            <Footer />
        </>
    );
}
