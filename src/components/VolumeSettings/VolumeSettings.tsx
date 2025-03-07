/* Volume Settings

        Order of sliders should be: default volume, accent volume, master volume by grouping in resposive order;
*/

import React from 'react';
import { useAudioEngine } from '@/context/AudioContext';
import useAudioStore from '@/store/useAudioStore';
import VolumeSlider from '@/components/VolumeSlider';
import * as Button from "@/components/common/Button";
import './volume_settings.css';

const VOLUME_SETTINGS_KEY = 'volume-settings';

export default function VolumeSettings() {
    const [isOpened, setIsOpened] = React.useState(false);
    const audioEngine = useAudioEngine();
    const {
        masterVolume,
        setMasterVolume,
        defaultSoundVolume,
        setDefaultSoundVolume,
        accentSoundVolume,
        setAccentSoundVolume
    } = useAudioStore();

    const handleMasterVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = Number(event.target.value);
        audioEngine.setMasterVolume(inputValue);
        setMasterVolume(inputValue);
    };

    const handleDefaultVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = Number(event.target.value);
        audioEngine.setDefaultSoundVolume(inputValue);
        setDefaultSoundVolume(inputValue);
    };

    const handleAccentVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = Number(event.target.value);
        audioEngine.setAccentSoundVolume(inputValue);
        setAccentSoundVolume(inputValue);
    };

    return (
        <div className="volume-settings">
            <Button.VolumeSettings onClick={() => setIsOpened(!isOpened)}>
                <span className='heading'>View Volume Settings</span>
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
