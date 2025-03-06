import { useAudioEngine } from '@/context/AudioContext';

import VolumeSlider from '@/components/VolumeSlider';
import createLocalStorageService from '@/services/localStorageService';

import './volume_settings.css';

const VOLUME_SETTINGS_KEY = 'volume-settings';

export default function VolumeSettings() {
    const audioEngine = useAudioEngine();
    const localStorageService = createLocalStorageService(VOLUME_SETTINGS_KEY);

    const saveToVolumeSettings = () => {
        localStorageService.set({
            masterVolume: audioEngine.getMasterVolume(),
            defaultVolume: audioEngine.getDefaultSoundVolume(),
            accentVolume: audioEngine.getAccentSoundVolume(),
        });
    }
    const handleMasterVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        audioEngine.setMasterVolume(Number(event.target.value) / 100);
        l
    };

    const handleDefaultVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        audioEngine.setDefaultSoundVolume(Number(event.target.value) / 100);
    };

    const handleAccentVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        audioEngine.setAccentSoundVolume(Number(event.target.value) / 100);
    };

    return (
        <div className="volume-settings">
            <h2 className='heading'>Volume Settings</h2>

            <form action="#" id="controls">
                <VolumeSlider
                    label='master volume'
                    volume={localStorageService.get()?.masterVolume || 50}
                    handleVolumeChange={handleMasterVolumeChange}
                />
                <VolumeSlider
                    label='default volume'
                    volume={localStorageService.get()?.defaultVolume || 50}
                    handleVolumeChange={handleDefaultVolumeChange}
                />
                <VolumeSlider
                    label='accent volume'
                    volume={localStorageService.get()?.accentVolume || 50}
                    handleVolumeChange={handleAccentVolumeChange}
                />
            </form>
        </div>
    );
}
