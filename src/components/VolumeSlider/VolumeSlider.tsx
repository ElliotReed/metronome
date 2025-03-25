import { SpeakerMutedSVG, SpeakerOnSVG } from '../icons/Icons';

import './volume-slider.css';

type VolumeSliderProps = {
    label: string;
    volume: number;
    handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VolumeSlider({ label, volume, handleVolumeChange }: VolumeSliderProps) {
    function convertTextCase(text: string, textCase: "snake-case" | "camelCase"): string {

        if (text.split(' ').length > 1 && textCase === "snake-case") {
            return text.split(' ').join('-').toLowerCase();
        }

        return text;
    }
    const id = `${convertTextCase(label, 'snake-case')}-input`;
    return (
        <div className="volume-slider">
            <label htmlFor={id}>
                {label}
            </label>
            {volume > 0 ? <SpeakerOnSVG /> : < SpeakerMutedSVG />}
            <input
                id={id}
                className="slider"
                type="range"
                name="volume-input"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
            />
            <span className="value-display">{volume * 100}%</span>
        </div>
    );
}