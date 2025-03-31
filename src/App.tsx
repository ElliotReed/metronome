import React from 'react';

import { useAudioStore } from './store/useAudioStore';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { NoiseBackgroundGenerator } from "@/components/BackgroundNoiseGenerator";


import defaultSound from "/assets/drumstick.wav";
import accentSound from "/assets/drumstick-accent.wav";

import '@/common.css';
import '@/App.css'; // netlify build fails if this is renamed to 'app.css', weird?

export default function App({ children }: { children: React.ReactNode }) {
    const { loadAccentSound, loadDefaultSound, initializeAudio } = useAudioStore();
    //  Instantiates the audio store and loads the default and accent sounds
    React.useEffect(() => {
        initializeAudio();
        loadDefaultSound(defaultSound);
        loadAccentSound(accentSound);
    }, [useAudioStore]);

    React.useEffect(() => {
        const preloader = document.getElementById('preloader');
        const removePreloader = () => {
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.remove(), 500);
            }
        }
        window.addEventListener('load', removePreloader);
    }, []);

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
            <main className="main scrollbar main-layout-grid">
                {children}
            </main>
            <Footer />
        </>
    );
}
