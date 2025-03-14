import PageHeading from '../common/PageHeading';
import VolumeSettings from './VolumeSettings';

import './settings.css';

export default function Settings() {
    return (
        <div className="settings main-layout-grid main-layout-grid-full-width">
            <PageHeading color='dark'>Settings</PageHeading>
            <VolumeSettings />
        </div>
    )
}