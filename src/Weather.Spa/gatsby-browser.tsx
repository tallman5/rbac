import { msalConfig } from './src/authConfig';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import React from 'react';

const msalInstance = new PublicClientApplication(msalConfig);

export const wrapRootElement = ({ element }: any) => {
    return (
        <MsalProvider instance={msalInstance} >
            {element}
        </MsalProvider>
    )
}
