import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: process.env.GATSBY_CLIENT_ID || '8e593ac1-6e6a-47ad-a78b-53eba4158da7',
        authority: process.env.GATSBY_AUTHORITY || 'https://login.microsoftonline.com/a2716cd4-06bd-4131-a023-1a69bfae111a',
        redirectUri: process.env.GATSBY_REDIRECT || 'http://localhost:8000',
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
};

export const scopes = [
    process.env.GATSBY_SCOPE || 'api://964551ca-0770-4ad5-b9bd-86b9fe724ac2/.default'
]

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes
};
