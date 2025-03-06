import React from 'react';
import { createRoot } from 'react-dom/client';

import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import { AudioEngineProvider } from './context/AudioContext';

import '@/normalize.css';
import '@/index.css';

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
      <AudioEngineProvider>
        <RouterProvider router={router} />
      </AudioEngineProvider>
    </React.StrictMode>
  )
};
