import { ErrorPage } from "./components/ErrorPage";
import { MarkdownViewer } from "./components/MarkdownViewer";
import { Root } from "./components/Root";

export const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <MarkdownViewer />,
      },
    ],
  },
];
