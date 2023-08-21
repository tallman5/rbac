import * as React from "react"
import { useMsal } from '@azure/msal-react';
import { loginRequest, scopes } from "../authConfig";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

const IndexPage = () => {
  const { accounts, instance } = useMsal();
  const [tokenRaw, setTokenRaw] = useState('');
  const [tokenDecoded, setTokenDecoded] = useState('');
  const [anonRes, setAnonRes] = useState('');
  const [authRes, setAuthRes] = useState('');
  const [authAdimRes, setAuthAdminRes] = useState('');
  const [authDeviceRes, setAuthDeviceRes] = useState('');

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .then((response) => {
        console.log(response);
        if (response.account) {
          const accessTokenRequest = {
            scopes,
            account: response.account,
          };

          instance.acquireTokenSilent(accessTokenRequest)
            .then((accessTokenResponse) => {
              console.log(accessTokenResponse);
              setTokenRaw(accessTokenResponse.accessToken);
              setTokenDecoded(jwt_decode(accessTokenResponse.accessToken));
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const handleLogout = () => {
    clearData();
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
    });
  }

  const callApis = () => {
    const methods = ["get-anon", "get-auth", "get-auth-admin", "get-auth-device"]

    methods.forEach(method => {
      const headers = new Headers();
      headers.set('method', 'GET')
      headers.set("Content-Type", 'application/json')
      headers.set("contentType", 'application/x-www-form-urlencoded')
      if (method !== "get-anon")
        headers.set('Authorization', 'Bearer ' + tokenRaw);

      const requestInit: RequestInit = {
        method: 'GET',
        headers,
      }

      const url = "https://localhost:7032/WeatherForecast/" + method;

      fetch(url, requestInit)
        .then(response => {
          if (response.ok) {
            console.info("Success on " + method);
            return response.json()
          }
          else {
            console.warn("Response not OK on " + method + ": " + response.status)
            return null
          }
        })
        .then(data => {
          if (data) {
            console.log(data);
            return data;
          }
        })
        .catch(error => {
          console.warn(error);
          return null;
        })
    });
  }

  const clearData = () => {
    setTokenRaw('');
    setAnonRes('');
    setAuthRes('');
    setAuthAdminRes('');
    setAuthDeviceRes('');
  }

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <h1>RBAC Testing</h1>
        <button type="button" onClick={() => { handleLogin() }} disabled={(accounts && accounts.length > 0)}>Sign In</button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button type="button" onClick={() => { handleLogout() }} disabled={!(accounts && accounts.length > 0)}>Sign Out</button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button type="button" onClick={() => { callApis() }}>Call APIs</button>
      </div>
      <br />
      <div>
        <h2>Current Account:</h2>
        <pre>
          {
            (accounts && accounts.length > 0)
              ? JSON.stringify(accounts[0], null, 2)
              : 'Not signed in'
          }
        </pre>
      </div>
      <br />
      <div>
        <h2>Access Token Raw:</h2>
        <div>
          {
            (accounts && accounts.length > 0)
              ? tokenRaw
              : 'Not signed in'
          }
        </div>
      </div>
      <br />
      <div>
        <h2>Access Token Decoded:</h2>
        <pre>
          {
            (accounts && accounts.length > 0)
              ? JSON.stringify(tokenDecoded, null, 2)
              : 'Not signed in'
          }
        </pre>
      </div>
    </div>
  )
}

export default IndexPage
