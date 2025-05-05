# Project Overview: Djentronome

**Last Updated:** Monday, May 06, 2025 at 01:42:00 PM

## 1. Introduction

**Project Name:** Djentronome

An open-source rhythm game designed for electronic drummers to sight-read and play along with Djent-style songs in real time. Built specifically to integrate with the Alesis Nitro drum kit, the goal is to bring the Guitar Hero experience to modern drumming practice with real-time kick/snare transcription, YouTube/Spotify integration, and responsive gameplay mechanics.

---

## 2. Problem Definition

### 2.1. Problem Statement

Drummers, especially those practicing complex metal subgenres like Djent, lack an interactive and visual way to sight-read rhythmic parts and practice timing in a fun, game-like setting. Most available tools focus on either sheet music or generic rhythm games that do not support real drum kits.

### 2.2. Target Audience

* Intermediate to advanced drummers with electronic kits (e.g., Alesis Nitro)
* Musicians interested in timing practice with metal/prog/djent music
* Gamers/musicians who want a Guitar Hero-style experience for drumming

### 2.3. Current Solutions and Pain Points

* MIDI drum trainers (e.g., Melodics) don’t support kick/snare-focused sight-reading for metal
* YouTube play-alongs require mental transcription with no interactivity or feedback
* Guitar Hero/Rock Band games are not real-instrument compatible

### 2.4. Evidence

* Widespread demand for real instrument support in rhythm games
* Alesis Nitro kits are top-selling e-drum kits with USB/MIDI compatibility
* Djent as a genre is rhythmically complex, making it ideal for timing-based gameplay

---

## 3. Solution Overview

### 3.1. Solution Description

A web-based rhythm game that allows players to:

* Select a Djent song from YouTube or Spotify
* Transcribe kick/snare drum parts (either pre-processed or live)
* Display a Guitar Hero-style visual track
* Score hits and misses based on MIDI input from an Alesis Nitro drum kit
* Provide visual/audio feedback and track performance

### 3.2. Key Features and Functionalities

* 🎵 YouTube/Spotify integration for loading songs
* 🥁 Kick + snare transcription for sight-reading
* 🎮 Guitar Hero-style interface (note lanes, timing windows)
* 🧠 Scoring system with combo multipliers and accuracy rating
* 📉 Playback statistics and performance graphs
* ⏱ Sync calibration tools (latency handling)
* 🧪 Test tracks and transcription utilities for development

### 3.3. Value Proposition

An immersive, low-friction, and fun way for drummers to practice sight-reading kick/snare rhythms with real music. Builds muscle memory and timing while keeping users engaged.

### 3.4. Success Metrics

* Accuracy improvements in repeat playthroughs
* Session time and retention
* Reduced transcription error rate
* Community engagement and custom track contributions

---

## 4. Unique Differentiators

### 4.1. Competitive Landscape

* Melodics (focused on grooves, not sight-reading)
* Clone Hero / Rock Band emulators (not compatible with real drums)
* YouTube play-alongs (passive viewing only)

### 4.2. Key Differentiators

* Native support for Alesis Nitro via USB/MIDI
* Real-time transcription of kick/snare
* Full-featured monorepo designed for modular expansion
* Deep customization potential and developer-friendly architecture

### 4.3. Competitive Advantages

* Faster iteration via AI-assisted ruleset
* Open-source and modular (easily extendable)
* Fun + skill building hybrid
* Native Typescript + React + Mantine stack makes frontend highly customizable

---

## 5. Technology Stack

### 5.1. Proposed Technologies

* **Frontend:** React (Vite), Mantine UI, Storybook
* **Backend/Logic:** Typescript monorepo (Nx / pnpm / Turborepo)
* **Testing:** Vitest, Testing Library, Storybook Test Mode
* **Transcription:** FFmpeg + YouTube downloader CLI, audio fingerprinting tools TBD
* **MIDI Input:** Web MIDI API (for real-time e-drum input)
* **Visualization:** R3F (Three.js) for future note highway
* **Tooling:** Shared ESLint, Prettier, and TSConfig packages

### 5.2. Rationale

* Vite enables fast dev experience
* Monorepo ensures shared config + scalable feature split
* Web MIDI allows hardware integration without native apps
* Mantine for flexible and fast component development
* Storybook provides interactive UI snapshots for test + polish

---

## 6. User Stories

### 6.1. Drummer

* As a drummer, I want to select a Djent song from YouTube, so I can play along.
* As a drummer, I want to see the kick and snare parts transcribed onto a note track.
* As a drummer, I want to plug in my Alesis Nitro kit and have it recognized automatically.
* As a drummer, I want to see a score and accuracy breakdown after each song.
* As a drummer, I want to calibrate my latency if the timing feels off.

### 6.2. Developer

* As a developer, I want modular libraries for audio, transcription, scoring, and UI.
* As a developer, I want test utilities and stubs for new note generation features.
* As a developer, I want functional test rules and Storybook stories to validate components quickly.

---

## 7. Project Directory Structure

See [./directory-structure.md](./directory-structure.md) for a full breakdown.
