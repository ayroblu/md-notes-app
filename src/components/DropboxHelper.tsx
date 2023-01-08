import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";


import {
  dropboxCallbackAuthState,
  dropboxRefreshTokenState,
  hasRedirectedFromAuth,
  runDropboxAuth,
} from "../data-model/dropbox-auth";
import { useStable } from "../hooks/useStable";

import styles from "./DropboxHelper.module.css";
import { EditingLayout } from "./EditingLayout";

export function DropboxHelper() {
  const isAuthed = !!useRecoilValue(dropboxRefreshTokenState);
  if (isAuthed) {
    return <EditingLayout />;
  } else {
    return <DropboxAuthScreen />;
  }
}
function DropboxCallbackHandler() {
  if (hasRedirectedFromAuth()) {
    return <DropboxCallbackHandleAuth />;
  }
  return null;
}
function DropboxCallbackHandleAuth() {
  const [response, setResponse] = useRecoilState(dropboxCallbackAuthState);
  const navigate = useStable(useNavigate());
  React.useLayoutEffect(() => {
    setResponse(response);
    // Trying to get rid of url search param (oauth code)
    // This doesn't really do anything for HashRouter, so use the replaceState manually
    navigate(location.pathname, { replace: true });
    history.replaceState(history.state, "", location.pathname);
  }, [navigate, response, setResponse]);
  return null;
}
function DropboxAuthScreen() {
  const authHandler = React.useCallback(() => {
    runDropboxAuth();
  }, []);
  return (
    <>
      <DropboxCallbackHandler />
      <div className={styles.container}>
        <h1>Markdown Notes App sync with Dropbox</h1>
        <p>
          This is a Markdown Notes App, where you need to sync with dropbox in
          order to use it
        </p>
        <button onClick={authHandler}>Auth with Dropbox</button>
      </div>
    </>
  );
}
