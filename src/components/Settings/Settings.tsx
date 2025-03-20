import PageHeading from '../common/PageHeading';
import VolumeSettings from './VolumeSettings';

import './settings.css';

export default function Settings() {
    return (
        <>
            <PageHeading color='dark'>Settings</PageHeading>
            <VolumeSettings />
        </>
    )
}