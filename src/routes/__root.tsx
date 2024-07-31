import * as React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router';

const TanStackRouterDevtools =
  import.meta.env.VITE_NODE_ENV === 'production'
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
    { console.log('env ', import.meta.env.VITE_NODE_ENV)}
      <main className="main scrollbar0">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  )
})