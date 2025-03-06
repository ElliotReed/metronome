import * as React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router';

import App from '@/App';

const TanStackRouterDevtools =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools
      })),
    )

export const Route = createRootRoute({
  component: () => (
    <>
      {/* {console.log('env ', import.meta.env.VITE_NODE_ENV)} */}
      <App>
        <Outlet />
      </App>
      <TanStackRouterDevtools />
    </>
  )
})