import VolumeSettings from './VolumeSettings';

import './settings.css';

export default function Settings() {
    return (
        <div className="settings">
            <h1 className="title">Settings</h1>
            <VolumeSettings />
        </div>
    )
}