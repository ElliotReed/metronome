import React from 'react';

import { useAudioStore } from './store/useAudioStore';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { NoiseBackgroundGenerator } from "@/components/BackgroundNoiseGenerator";


import defaultSound from "/assets/drumstick.wav";
import accentSound from "/assets/drumstick-accent.wav";

import '@/common.css';
import '@/app.css';

export default function App({ children }: { children: React.ReactNode }) {
    const { loadAccentSound, loadDefaultSound, initializeAudio } = useAudioStore();
    //  Instantiates the audio store and loads the default and accent sounds
    React.useEffect(() => {
        initializeAudio();
        loadDefaultSound(defaultSound);
        loadAccentSound(accentSound);
    }, [useAudioStore]);

    //  NoiseBackgroundGenerator sets custom properties on the root element to generate noise backgrounds
    return (
        <>
            <Header />
            <NoiseBackgroundGenerator
                sourceColorVar="--clr-primary"
                targetBackgroundVar='--bg-noise-primary'
            />
            <NoiseBackgroundGenerator
                sourceColorVar="--clr-dark-noise-source"
                targetBackgroundVar='--bg-noise-dark'
                opacity={0.3}
            />
            <NoiseBackgroundGenerator
                sourceColorVar="--clr-light-noise-source"
                targetBackgroundVar='--bg-noise-light'
                opacity={0.6}
            />
            <main className="main scrollbar">
                {children}
            </main>
            <Footer />
        </>
    );
}
