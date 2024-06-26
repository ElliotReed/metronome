import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

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