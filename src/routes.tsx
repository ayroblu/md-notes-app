import { DropboxHelper } from "./components/DropboxHelper";
import { ErrorPage } from "./components/ErrorPage";
import { Root } from "./components/Root";

export const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <DropboxHelper />,
      },
    ],
  },
];
