import { DropboxResponseError } from "dropbox";
import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import {
  dropboxAccessTokenState,
  dropboxRefreshTokenState,
} from "../data-model/dropbox-auth";

export function ErrorPage() {
  const error = useRouteError();
  useDropboxAuthCatcher();

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {isRouteErrorResponse(error)
            ? error.statusText
            : error instanceof Error
            ? error.message
            : null}
        </i>
      </p>
    </div>
  );
}
export function NotFoundPage() {
  return (
    <div>
      <p>Sorry, failed to find the page you're looking for</p>
    </div>
  );
}
function useDropboxAuthCatcher() {
  const error = useRouteError();
  const setRefreshToken = useSetRecoilState(dropboxRefreshTokenState);
  const setAccessToken = useSetRecoilState(dropboxAccessTokenState);
  React.useEffect(() => {
    if (error instanceof DropboxResponseError) {
      if (error.status === 401) {
        setRefreshToken(undefined);
        setAccessToken(undefined);
      }
    }
  }, [error, setAccessToken, setRefreshToken]);
}
