import { Link } from '@tanstack/react-router';

import { SpeakerOnSVG } from '../icons/Icons';

import './settings-link.css';

export default function SettingsLink() {
    return (
        <div className="settings-link">
            <Link to='/settings'>
                <SpeakerOnSVG />
                <span>Settings</span>
            </Link>
        </div>
    );
}