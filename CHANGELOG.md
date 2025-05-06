# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Audio event system for emitting and listening to audio-related events
- Support for loading audio from various sources (file, URL, ArrayBuffer)
- Sync point system for synchronizing game events with audio playback
- E2E test for local audio file playback
- Unit tests for the audio event system
- Comprehensive documentation for the audio playback feature

### Changed
- Enhanced AudioEngine to support more granular playback control
- Improved testing infrastructure with proper mocking of AudioContext
- Updated README with new feature documentation

## [0.1.0] - 2025-04-05

### Added
- Initial release
- Basic audio engine functionality
- Sound loading and playback
- Volume control and audio enabled/disabled toggle 