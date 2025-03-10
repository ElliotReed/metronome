/* Volume Settings

        Order of sliders should be: default volume, accent volume, master volume by grouping in resposive order;
*/

import React from 'react';

import { useAudioStore } from '@/store/useAudioStore';

import VolumeSlider from '@/components/VolumeSlider';
import * as Button from "@/components/common/Button";
import { SpeakerOnSVG } from '@/components/icons/Icons';
import './volume_settings.css';

const VOLUME_SETTINGS_KEY = 'volume-settings';

export default function VolumeSettings() {
    const [isOpened, setIsOpened] = React.useState(false);
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
        <div className="volume-settings">
            <Button.VolumeSettings onClick={() => setIsOpened(!isOpened)}>
                <SpeakerOnSVG />
                <span>Settings</span>
            </Button.VolumeSettings>

            <form
                id="controls"
                data-is-opened={isOpened ? 'true' : 'false'}
            >
                <Button.Close onClick={() => setIsOpened(false)}>
                    <span>Close Settings</span>
                </Button.Close>
                <VolumeSlider
                    label='default volume'
                    volume={defaultSoundVolume}
                    handleVolumeChange={handleDefaultVolumeChange}
                />
                <VolumeSlider
                    label='accent volume'
                    volume={accentSoundVolume}
                    handleVolumeChange={handleAccentVolumeChange}
                />
                <VolumeSlider
                    label='master volume'
                    volume={masterVolume}
                    handleVolumeChange={handleMasterVolumeChange}
                />
            </form>
        </div>
    );
}
