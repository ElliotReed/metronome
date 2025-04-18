# Metronome

by Elliot Reed

version 2.1.0

## Dependencies

    @tanstack/react-router [Tanstack](https://tanstack.com/)
    classnames
    react
    react-dom
    zustand

### DevDependencies

    @tanstack/router-devtools [Tanstack](https://tanstack.com/)
    @tanstack/router-plugin [Tanstack](https://tanstack.com/)
    @types/react
    @types/react-dom
    @vitejs/plugin-react
    typescript
    vite
    vite-plugin-svgr
    vite-tsconfig-paths

## Overview

Use a seperate "engine" to run the clock and send custom events to notify elements that respond to metronome clicks

Using zustand for state and local storage.

## Deployment

CI is setup for the following:

- https://cool-metronome.netlify.app

- https://metronome.elliotreed.net

### Staging

The dev branch will auto deploy to:

- https://staging.metronome.elliotreed.net