import { Dropbox, DropboxAuth } from "dropbox";
import { atom, selector } from "recoil";

import { syncIdbEffect } from "./effects";

// Dropbox auth based on their Auth guide and their example:
// https://developers.dropbox.com/oauth-guide
// https://github.com/dropbox/dropbox-sdk-js/blob/main/examples/javascript/pkce-browser/index.html

export const dropboxRefreshTokenState = atom<string | undefined>({
  key: "dropboxRefreshTokenState",
  default: undefined,
  effects: [syncIdbEffect("dropboxRefreshToken")],
});
export const dropboxAccessTokenState = atom<string | undefined>({
  key: "dropboxAccessTokenState",
  default: undefined,
  effects: [syncIdbEffect("dropboxAccessToken")],
});
// https://github.com/facebookexperimental/Recoil/issues/2152
// export const dropboxIsAuthedState = selector<boolean>({
//   key: "dropboxIsAuthedState",
//   get: ({ get }) => {
//     const refreshToken = get(dropboxRefreshTokenState);
//     return !!refreshToken;
//   },
// });
export const dropboxClientState = selector<() => Dropbox>({
  key: "dropboxClientState",
  get: ({ get }) => {
    const refreshToken = get(dropboxRefreshTokenState);
    if (!refreshToken) {
      throw new Error("Dropbox refresh token not found!");
    }
    const dbxAuth = getDropboxAuth();
    dbxAuth.setRefreshToken(refreshToken);
    const accessToken = get(dropboxAccessTokenState);
    if (accessToken) {
      dbxAuth.setAccessToken(accessToken);
    }
    const dbx = new Dropbox({
      auth: dbxAuth,
    });
    return () => dbx;
  },
});
export const dropboxCallbackAuthState = selector({
  key: "dropboxCallbackAuthState",
  get: () => postRedirectDropboxAuth(),
  set: ({ get, set }) => {
    const authResponseResult = get(dropboxCallbackAuthState);
    const refreshToken = authResponseResult.refresh_token;
    if (refreshToken) {
      set(dropboxRefreshTokenState, refreshToken);
    }
    const accessToken = authResponseResult.access_token;
    if (accessToken) {
      set(dropboxAccessTokenState, accessToken);
    }
  },
});
export async function runDropboxAuth() {
  const dbxAuth = getDropboxAuth();
  const redirectUrl = `${location.origin}${location.pathname}`;
  const authUrl = await dbxAuth.getAuthenticationUrl(
    redirectUrl,
    undefined,
    "code",
    "offline",
    // we specifically dont need account_info.read, to omit it, specify the other properties explicitly
    [
      "files.metadata.read",
      "files.metadata.write",
      "files.content.read",
      "files.content.write",
    ],
    undefined,
    true,
  );
  window.sessionStorage.setItem("codeVerifier", dbxAuth.getCodeVerifier());
  window.location.href = authUrl.toString();
}
export function hasRedirectedFromAuth() {
  return !!getCodeFromUrl();
}

function getDropboxAuth() {
  const dbxAuth = new DropboxAuth({
    clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID,
  });
  return dbxAuth;
}
function getCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
}

async function postRedirectDropboxAuth(): Promise<DropboxResponseResult> {
  const dbxAuth = getDropboxAuth();
  const codeVerifier = window.sessionStorage.getItem("codeVerifier");
  window.sessionStorage.removeItem("codeVerifier");
  const urlCode = getCodeFromUrl();
  if (!codeVerifier || !urlCode) {
    // redirect to non redirect url?
    return {};
  }
  dbxAuth.setCodeVerifier(codeVerifier);
  const redirectUrl = `${location.origin}${location.pathname}`;
  const response = await dbxAuth.getAccessTokenFromCode(redirectUrl, urlCode);
  const authResponseResult = response.result as DropboxResponseResult;
  return authResponseResult;
}
type DropboxResponseResult = {
  access_token?: string;
  refresh_token?: string;
};
