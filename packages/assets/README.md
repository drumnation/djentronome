# Assets Package for Djentronome

This package provides asset management for the Djentronome game engine, handling:

- Sound assets (music, SFX, ambience, voices)
- Sprite assets (characters, environments, UI, effects)
- Asset loading and status tracking

## Features

- Centralized asset registry
- Async loading of assets
- Loading progress tracking
- Asset categorization

## Usage

```typescript
import { loadSprite, loadSound, getAssetStatus } from '@djentronome/assets';
import { playerIdle, playerRun } from '@djentronome/assets/sprites';
import { jump, mainTheme } from '@djentronome/assets/sounds';

// Load individual assets
await loadSprite(playerIdle);
await loadSound(jump);

// Load multiple assets in parallel
await Promise.all([
  loadSprite(playerRun),
  loadSound(mainTheme)
]);

// Check loading status
const status = getAssetStatus(playerIdle.id);
if (status?.status === 'loaded') {
  // Asset is ready to use
}
```

## Asset Organization

### Sound Assets

Sounds are organized by category:
- `sfx`: Short sound effects
- `music`: Background music tracks
- `ambient`: Environmental ambient sounds
- `voice`: Character voices and dialogue

### Sprite Assets

Sprites are organized by category:
- `character`: Player and NPC sprites
- `environment`: Tileset, backgrounds, props
- `ui`: User interface elements
- `effect`: Visual effects and particles

## Testing

```bash
# Run all tests
pnpm test

# Run specific test types
pnpm test:unit
pnpm test:integration
pnpm test:e2e
```

## License

Internal use only - Djentronome Project
