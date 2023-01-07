import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { dropboxFilesState } from "../data-model/dropbox";
import {
  dropboxCallbackAuthState,
  dropboxRefreshTokenState,
  hasRedirectedFromAuth,
  runDropboxAuth,
} from "../data-model/dropbox-auth";
import { useStable } from "../hooks/useStable";
import { exhaustiveCheck } from "../utils/main";

export function DropboxHelper() {
  const isAuthed = !!useRecoilValue(dropboxRefreshTokenState);
  if (isAuthed) {
    return <DropboxFiles />;
  } else {
    return <DropboxAuthButton />;
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
    // This doesn't really do anything for HashRouter, so use the replaceState manually
    navigate(location.pathname);
    history.replaceState(history.state, "", location.pathname);
  }, [navigate, response, setResponse]);
  return null;
}
function DropboxAuthButton() {
  const authHandler = React.useCallback(() => {
    runDropboxAuth();
  }, []);
  return (
    <>
      <DropboxCallbackHandler />
      <div>
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
function DropboxFiles() {
  const files = useRecoilValue(dropboxFilesState);
  return (
    <ul>
      {files.result.entries.map((entry) => {
        switch (entry[".tag"]) {
          case "file":
            return <li key={entry.id}>{entry.name}</li>;
          case "folder":
            return <li key={entry.id}>{entry.name}</li>;
          case "deleted":
            return null;
          default:
            exhaustiveCheck(entry);
            return null;
        }
      })}
    </ul>
  );
}
