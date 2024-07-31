import * as React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router';

const TanStackRouterDevtools =
  process.env.REACT_APP_NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools
      })),

    )

import Header from '@/components/Header';

import '@/normalize.css';
import '@/index.css';
import '@/App.css';

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <main className="main scrollbar0">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  )
})