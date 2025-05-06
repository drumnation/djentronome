# Project: Djentronome

## Status: ⭕ Planning

## Last Updated: Monday, May 05, 2025 at 10:52:40 PM

## 1. Project Overview

### 1.1. Objectives

*   Develop an open-source, web-based rhythm game for electronic drummers to practice sight-reading Djent-style songs.
*   Integrate with Alesis Nitro drum kits via Web MIDI API for real-time input.
*   Implement kick and snare transcription functionality (from YouTube/Spotify or pre-processed).
*   Provide a Guitar Hero-style visual interface for gameplay.
*   Create a scoring system with accuracy feedback and performance tracking.
*   Ensure a modular and extensible architecture using a TypeScript monorepo.
*   `[ ]` Confirmed objectives with Human Architect.

### 1.2. Scope

*   **Inclusions:**
    *   Core rhythm game mechanics (note highway, timing windows, scoring).
    *   Alesis Nitro drum kit integration via Web MIDI.
    *   Kick/snare transcription module (initial version, potentially offline/pre-processed first).
    *   Song loading mechanism (e.g., from local files or a defined format, YouTube/Spotify integration TBD).
    *   Basic UI for song selection, gameplay, and results screen (using React/Mantine).
    *   Latency calibration tool.
    *   Development tooling setup (linting, formatting, testing, Storybook).
    *   Core packages for game loop, state, input, audio, graphics (basic versions).
*   **Exclusions:**
    *   Full transcription of all drum parts (hi-hats, cymbals, toms) beyond kick/snare in the initial scope.
    *   Advanced visual effects beyond the basic note highway.
    *   Multiplayer functionality.
    *   User accounts or online leaderboards.
    *   Support for drum kits other than Alesis Nitro initially.
    *   Mobile platform support.
    *   Complex AI for adaptive difficulty or procedural generation.
*   `[ ]` Confirmed scope with Human Architect.

### 1.3. Key Stakeholders

*   **Human Architect (You):** Primary decision-maker, product owner.
*   **Agent Architect (Me):** Facilitator, planner, technical lead for AI agents.
*   **Target Users:** Intermediate/advanced electronic drummers, musicians practicing timing.
*   **Open Source Community:** Potential contributors and users.
*   `[ ]` Confirmed stakeholders with Human Architect.

### 1.4. Technology Stack

*   **Architecture:** TypeScript Monorepo (pnpm workspaces, Turborepo).
*   **Frontend:** React (Vite), Mantine UI, R3F (for potential future visualization).
*   **Core Logic:** TypeScript.
*   **State Management:** Potentially Zustand (as per `zustand.rules.mdc`).
*   **Input:** Web MIDI API.
*   **Testing:** Vitest, Testing Library, Storybook.
*   **Tooling:** Shared ESLint, Prettier, TSConfig packages.
*   **Transcription:** Potentially FFmpeg, YouTube downloaders (CLI/libs), Audio processing libraries TBD.
*   `[ ]` Confirmed technology stack with Human Architect.

## 2. Project Phases

### 2.1. Proposed Phases

*   **Phase 1: Foundation & Static Gameplay Core:**
    *   Establish monorepo, tooling, basic UI shell (React/Mantine), essential core packages (input, MIDI handling, game loop, state management).
    *   Implement Web MIDI API integration for Alesis Nitro kick/snare detection.
    *   Develop core gameplay visualization (vertical note lanes, timing window) - potentially starting with basic rendering before Three.js.
    *   Implement static rhythm playback using manually defined JSON patterns synced to a basic audio context or metronome.
    *   Integrate MIDI input for hit detection and basic scoring against static patterns.
    *   *Goal:* Drum along with pre-coded patterns in the browser.
*   **Phase 2: Audio Playback & Basic Transcription:**
    *   Implement robust audio playback system synced with game loop (handling local audio files).
    *   Develop initial offline kick/snare transcription module (e.g., using basic onset detection or simpler algorithms).
    *   Integrate transcribed note data into the gameplay system.
    *   Implement latency calibration tool.
    *   Refine scoring and feedback mechanisms.
    *   *Goal:* Drum along with rhythms transcribed from local audio files.
*   **Phase 3: Advanced Features & Integration:**
    *   Investigate and potentially implement more advanced transcription models (e.g., exploring Demucs, madmom, onsets-and-frames).
    *   Explore integration with YouTube/Spotify for metadata and playback control (acknowledging audio analysis limitations).
    *   Refine transcription accuracy, BPM detection, and synchronization.
    *   Enhance gameplay visualization (potentially migrating to R3F/Three.js).
    *   *Goal:* Improve transcription quality and explore streaming service integration.
*   **Phase 4: Polish, Testing & Release Prep:**
    *   Refine UI/UX using Mantine components.
    *   Add comprehensive tests (unit, integration, potentially end-to-end for core paths).
    *   Optimize performance (rendering, audio processing, MIDI handling).
    *   Create user documentation and contribution guidelines.
    *   Prepare for an initial (alpha/beta) open-source release.
    *   *Goal:* A stable, polished initial version ready for user feedback.
*   `[ ]` Confirmed phases with Human Architect.

## 3. Agent Team Composition

### 3.1. Number of Agents

*   `3` agents
*   `[ ]` Confirmed number of agents with Human Architect.

### 3.2. Agent Specializations

*   Agent 1: Frontend & Visualization Specialist - Responsible for `game-ui` app, React components (Mantine), Storybook, gameplay visualization (Note Highway), R3F, UI/UX.
*   Agent 2: Core Systems & MIDI Specialist - Focuses on core TS packages (`game-loop`, `game-state`, `input`, `midi-handler`, `scoring`), Web MIDI API integration, core gameplay logic, system stability.
*   Agent 3: Audio & Transcription Specialist - Handles audio playback sync, kick/snare transcription algorithms, audio packages (`core-audio`, `sound`), interfacing with audio processing tools.
*   `[X]` Confirmed agent specializations with Human Architect.

### 3.3. Agent Personas

*   Agent 1: Agent Tony Stark - Innovative Frontend Wizard. Focuses on slick UI/UX, React, Mantine, R3F, and delivering a polished user experience.
*   Agent 2: Agent Spock - Logical Core Systems Engineer. Focuses on system integrity, efficiency, game loop, state, MIDI integration, and precise rule implementation.
*   Agent 3: Agent Q - Analytical Audio & Transcription Expert. Specializes in audio handling, synchronization, transcription algorithms, signal processing, and specialized audio tools.
*   `[X]` Confirmed agent personas with Human Architect.

## 4. MECE Feature Breakdown

### 4.1. Feature Prioritization

*   Method: MoSCoW (Must have, Should have, Could have, Won't have) will be used to prioritize features, focusing on delivering a core functional MVP first.
*   `[X]` Confirmed prioritization method with Human Architect.

### 4.2. Feature List (Prioritized - Initial Draft)

*   **Must Have:**
    *   `[X]` F1: Monorepo & Tooling Setup
    *   `[X]` F2: Core Packages Scaffolding
    *   `[X]` F3: Basic UI Shell
    *   `[X]` F4: Web MIDI Integration (Alesis Nitro Kick/Snare)
    *   `[X]` F5: Static Pattern Loader & Format
    *   `[X]` F6: Basic Game Loop
    *   `[X]` F7: Gameplay Visualization (Basic)
    *   `[X]` F8: Hit Detection & Basic Scoring
    *   `[X]` F9: Audio Playback (Local Files)
    *   `[X]` F11: Gameplay UI Screens (Basic Song Select, Gameplay, Results)
    *   `[X]` F12: Latency Calibration Tool
    *   `[X]` F16: Testing & QA (Core Functionality)
*   **Should Have:**
    *   `[X]` F10: Initial Transcription Module (Offline)
    *   `[X]` F15: Visualization Enhancement (R3F)
    *   `[X]` F17: Documentation (Basic User/Dev)
*   **Could Have:**
    *   `[X]` F13: Advanced Transcription Investigation
    *   `[X]` F14: Streaming Service Integration (Exploration)
*   **Won't Have (Initial Release):**
    *   Full transcription (beyond kick/snare)
    *   Advanced visual effects
    *   Multiplayer
    *   User accounts/leaderboards
    *   Support for other drum kits
    *   Mobile support
    *   Adaptive AI
*   `[X]` Confirmed feature list and priorities with Human Architect.

## 5. Agent Task Allocation

### 5.1. Agent 1: Agent Tony Stark (Frontend & Vis)

*   `[ ]` F3: Basic UI Shell
*   `[ ]` F7: Gameplay Visualization (Basic)
*   `[ ]` F11: Gameplay UI Screens
*   `[ ]` F12: Latency Calibration Tool (UI Aspects)
*   `[ ]` F15: Visualization Enhancement (R3F) (Should Have)

### 5.2. Agent 2: Agent Spock (Core Systems & MIDI)

*   `[ ]` F1: Monorepo & Tooling Setup
*   `[X]` F2: Core Packages Scaffolding
*   `[X]` F4: Web MIDI Integration (Alesis Nitro Kick/Snare)
*   `[X]` F5: Static Pattern Loader & Format
*   `[ ]` F6: Basic Game Loop
*   `[ ]` F8: Hit Detection & Basic Scoring
*   `[ ]` F12: Latency Calibration Tool (Logic Aspects)
*   `[ ]` F16: Testing & QA (Core Functionality)
*   `[ ]` F17: Documentation (Basic User/Dev) (Should Have)

### 5.3. Agent 3: Agent Q (Audio & Transcription)

*   `[ ]` F9: Audio Playback (Local Files)
*   `[ ]` F10: Initial Transcription Module (Offline) (Should Have)
*   `[ ]` F13: Advanced Transcription Investigation (Could Have)
*   `[ ]` F14: Streaming Service Integration (Exploration) (Could Have)

### 5.4. Workload Distribution
*   `[X]` Confirmed task allocation with Human Architect.
*   `[X]` Confirmed the agent workloads are balanced.

## 6. Skill-Jacks Assessment and Development

### 6.1. Required Skill-Jack Areas

*   **Agent 1 (Frontend):** React, Vite, Mantine UI, R3F/Three.js, Storybook, Component Patterns, UI/UX, Frontend Testing.
*   **Agent 2 (Core Systems):** Advanced TypeScript, Monorepo Tools, Game Loop Design, State Management (Zustand), Web MIDI API, Functional Testing, TDD, Game Architecture.
*   **Agent 3 (Audio/Transcription):** Web Audio API, Audio Sync, DSP Basics, Onset Detection, Transcription ML Models, Python (potentially), FFmpeg.
*   **Project-Wide:** Git, Collaboration, Documentation Standards.

### 6.2. Skill-Jack Gaps (Prioritized)

1.  **High:** Web MIDI API Deep Dive (Alesis Nitro specifics, real-time best practices).
2.  **High:** Audio Transcription Techniques Comparison & Implementation Guide.
3.  **High:** Web Audio API for Precise Game Synchronization & Latency Handling.
4.  **Medium:** R3F/Three.js Guide for Note Highway Visualization.
5.  **Medium:** Advanced Zustand Patterns for Complex Game State.
6.  **Low:** Mantine UI Examples for Game-Specific Components.

### 6.3. Skill-Jack Development Plan

*   Create new documents in `.brain/skill-jacks/` as features requiring them are developed:
    *   `web-midi-integration-guide.md`
    *   `audio-transcription-strategies.md`
    *   `web-audio-game-synchronization.md`
    *   `r3f-note-highway-guide.md`
    *   `zustand-game-state-patterns.md`
    *   `mantine-game-ui-examples.md`
*   Leverage existing `.brain/*.rules.mdc` and `.cursor/rules/` files extensively.
*   `[X]` Confirmed skill-jack development plan with Human Architect.

## 7. Agent `cursorrules` Configuration

### 7.1. Agent 1: Agent Tony Stark (Frontend & Vis)

*   Scenario: Create New React Component
    *   Skill-Jack: `Read ["./d-skill-jacks/react-component-standards.skill-jack.ts"]`
    *   Rules: `react-component-standards.rules.mdc`, `mantine-ui.rules.mdc`
*   Scenario: Implement Gameplay Visualization
    *   Skill-Jack: `Read ["../3-agent-q/d-skill-jacks/web-audio-game-synchronization.skill-jack.ts"]` (timing)
    *   Skill-Jack: (Future) `Read ["./d-skill-jacks/r3f-note-highway-guide.skill-jack.ts"]`
    *   Rules: `r3f-usage-core.rules.mdc`, `game-ui-ux.rules.mdc`
*   Scenario: Create UI Screen Component
    *   Skill-Jack: `Read ["./d-skill-jacks/react-component-standards.skill-jack.ts"]`
    *   Rules: `react-component-standards.rules.mdc`, `mantine-ui.rules.mdc`, `game-ui-ux.rules.mdc`
*   Scenario: Add Storybook Story/Test
    *   Skill-Jack: `Read ["./d-skill-jacks/react-component-standards.skill-jack.ts"]`
    *   Rules: `react-component-standards.rules.mdc`
*   `[X]` `.cursorrules` file created/updated for Agent 1.

### 7.2. Agent 2: Agent Spock (Core Systems & MIDI)

*   Scenario: Setup New Package
    *   Skill-Jack: `Read ["./d-skill-jacks/monorepo-tooling-pnpm-turbo.skill-jack.ts"]`
    *   Rules: `monorepo-library-setup.rules.mdc`, `agent-use-monorepo-docs.rules.mdc`
*   Scenario: Implement MIDI Handling
    *   Skill-Jack: `Read ["./d-skill-jacks/web-midi-integration.skill-jack.ts"]`
    *   Rules: `midi-handler.rules.mdc`
*   Scenario: Implement Core Game Logic
    *   Skill-Jack: `Read ["./d-skill-jacks/tdd-vitest.skill-jack.ts"]`
    *   Rules: `game-core-architecture.rules.mdc`, `functional-test-principles.rules`, `typescript-standards.rules.mdc`
*   Scenario: Update Documentation
    *   Rules: `agent-use-monorepo-docs.rules.mdc`, `monorepo-project-documentation-structure.rules.mdc`
*   `[X]` `.cursorrules` file created/updated for Agent 2.

### 7.3. Agent 3: Agent Q (Audio & Transcription)

*   Scenario: Implement Audio Playback
    *   Skill-Jack: `Read ["./d-skill-jacks/web-audio-game-synchronization.skill-jack.ts"]`
    *   Rules: `core-audio.rules.mdc`, `sound-and-music.rules.mdc`, `bpm-sync.rules.mdc`
*   Scenario: Develop Transcription Module
    *   Skill-Jack: `Read ["./d-skill-jacks/audio-transcription-strategies.skill-jack.ts"]`
*   Scenario: Test Audio Synchronization
    *   Skill-Jack: `Read ["./d-skill-jacks/web-audio-game-synchronization.skill-jack.ts"]`, `Read ["../2-agent-spock/d-skill-jacks/tdd-vitest.skill-jack.ts"]`
    *   Rules: `functional-test-principles.rules`
*   `[X]` `.cursorrules` file created/updated for Agent 3.

## 8. Plan Generation

### 8.1. Individual Agent Plans

*   Location: `.brain/[Agent Name ID]/a-project/[agent-name]-project-plan.md`
*   `[X]` Agent 1 Plan Generated: `1-agent-tony-stark/a-project/tony-stark-project-plan.md`
*   `[X]` Agent 2 Plan Generated: `2-agent-spock/a-project/spock-project-plan.md`
*   `[X]` Agent 3 Plan Generated: `3-agent-q/a-project/q-project-plan.md`

### 8.2. Full Project Task List

*   Location: `.brain/project-plan.md`
*   `[X]` Full project task list generated: `project-plan.md` (This file)