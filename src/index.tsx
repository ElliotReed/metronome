import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import { AudioProvider } from './context/AudioContext';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('metronome-root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AudioProvider>
        <RouterProvider router={router} />
      </AudioProvider>
    </React.StrictMode>

  )
};
