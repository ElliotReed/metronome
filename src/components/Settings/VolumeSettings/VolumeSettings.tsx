/* Volume Settings

        Order of sliders should be: default volume, accent volume, master volume by grouping in resposive order;
*/

import React from 'react';

import { useAudioStore } from '@/store/useAudioStore';

import PageHeading from '@/components/common/PageHeading';
import VolumeSlider from '@/components/VolumeSlider';

import './volume-settings.css';

const VOLUME_SETTINGS_KEY = 'volume-settings';

export default function VolumeSettings() {
    const {
        masterVolume,
        setMasterVolume,
        defaultSoundVolume,
        setDefaultSoundVolume,
        accentSoundVolume,
        setAccentSoundVolume
    } = useAudioStore();

    const handleMasterVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMasterVolume(Number(event.target.value));
    };

    const handleDefaultVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDefaultSoundVolume(Number(event.target.value));
    };

    const handleAccentVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccentSoundVolume(Number(event.target.value));
    };

    return (
        <>
            <form
                id="volume-settings__controls"
                className="volume-settings main-layout-grid__full-width main-layout-grid"
            >
                <PageHeading color='light'>Volume Settings</PageHeading>
                <VolumeSlider
                    label='default click volume'
                    volume={defaultSoundVolume}
                    handleVolumeChange={handleDefaultVolumeChange}
                />
                <VolumeSlider
                    label='accent click volume'
                    volume={accentSoundVolume}
                    handleVolumeChange={handleAccentVolumeChange}
                />
                <VolumeSlider
                    label='master volume'
                    volume={masterVolume}
                    handleVolumeChange={handleMasterVolumeChange}
                />
            </form>
        </>
    );
}
