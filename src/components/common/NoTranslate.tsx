import { ReactNode } from 'react';

export const NoTranslate = ({ children }: { children: ReactNode }) => {
    return (
        <span translate="no">{children}</span>
    );
}