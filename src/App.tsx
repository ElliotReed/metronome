import React from 'react';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import { useAudioStore } from './store/useAudioStore';

import defaultSound from "/assets/drumstick.wav";
import accentSound from "/assets/drumstick-accent.wav";

import "./App.css";

export default function App({ children }: { children: React.ReactNode }) {
    const { loadAccentSound, loadDefaultSound, initializeAudio } = useAudioStore();

    React.useEffect(() => {
        initializeAudio();
        loadDefaultSound(defaultSound);
        loadAccentSound(accentSound);
    }, [useAudioStore]);

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
