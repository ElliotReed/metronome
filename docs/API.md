# API Audio Settings

## Overview

This document outlines the API structure for managing audio settings. Initially, settings will be stored locally using browser local storage or a similar mechanism in mobile and desktop apps. Eventually, these settings will be backed up and synced from a server.

## Audio Settings Schema

### Properties:

- **VolumeLevel** (int) – Volume setting for the application (e.g., 1–100)
- **AccentVolumeLevel** (int) – Volume setting for accented beats (e.g., 1–100)
- **ClickSound** (string) – Type of metronome sound
  - Drumstick
  - HighHat
- **ClickAccentSound** (string) – Sound used for accented beats
  - Drumstick (accent)
  - HighHat (accent)

## Metronome Settings

- **Tempo** (int) – Beats per minute (BPM) setting
- **Pattern** (string) – Defines the rhythmic pattern of the metronome

