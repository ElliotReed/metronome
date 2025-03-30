import { PageHeading } from '@/components/common';
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