import React from "react";
import { Link, Outlet } from "react-router-dom";

export function Root() {
  return (
    <main>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <React.Suspense>
        <Outlet />
      </React.Suspense>
    </main>
  );
}
