// Per-sound variation config. Kept for API/type stability; playback is disabled.
type SFXConfig = {
  // One file, or several pre-rendered variations cycled round-robin per play.
  src: string | string[]
  // Random playback-rate range applied per play (1 = unchanged).
  rateRange?: [number, number]
  // Random volume multiplier range applied per play (1 = unchanged).
  volumeRange?: [number, number]
  // Minimum gap between two plays of this SFX. Triggers within this window
  // are silently dropped so bursty sequences don't phase-stack into noise.
  minIntervalMs?: number
  // Random stereo pan per play — max absolute offset (0 = center, 1 = hard
  // right). A small value like 0.15 keeps things centred but adds just enough
  // spread to stop repeats from stacking on the same point in the field.
  panJitter?: number
}

// SFX sound definitions (catalog retained; studio playback is off).
export const SFX: Record<string, SFXConfig> = {
  gridSnap: {
    src: [
      '/audios/sfx/grid_snap_0.mp3',
      '/audios/sfx/grid_snap_1.mp3',
      '/audios/sfx/grid_snap_2.mp3',
    ],
    rateRange: [0.98, 1.02],
    volumeRange: [0.5, 0.6],
    panJitter: 0.15,
    minIntervalMs: 50,
  },
  itemDelete: {
    src: '/audios/sfx/item_delete.mp3',
    rateRange: [0.9, 1.1],
    volumeRange: [0.9, 1.0],
    panJitter: 0.05,
  },
  itemPick: {
    src: '/audios/sfx/item_pick.mp3',
    rateRange: [0.95, 1.05],
    volumeRange: [0.92, 1.0],
    panJitter: 0.15,
  },
  itemPlace: {
    src: '/audios/sfx/item_place.mp3',
    rateRange: [0.98, 1.02],
    volumeRange: [0.9, 1.0],
    panJitter: 0.15,
  },
  itemRotate: {
    src: '/audios/sfx/item_rotate.mp3',
    rateRange: [0.94, 1.06],
    volumeRange: [0.92, 1.0],
    panJitter: 0.15,
  },
  resize: {
    src: ['/audios/sfx/resize_0.mp3', '/audios/sfx/resize_1.mp3', '/audios/sfx/resize_2.mp3'],
    rateRange: [0.98, 1.02],
    volumeRange: [0.26, 0.34],
    panJitter: 0.15,
    minIntervalMs: 80,
  },
  structureBuildStart: {
    src: '/audios/sfx/structure_build_start.mp3',
    rateRange: [0.95, 1.05],
    volumeRange: [0.88, 1.0],
    panJitter: 0.15,
  },
  structureBuildEnd: {
    src: '/audios/sfx/structure_build_end.mp3',
    rateRange: [0.95, 1.05],
    volumeRange: [0.88, 1.0],
    panJitter: 0.15,
  },
  structureDelete: {
    src: '/audios/sfx/structure_delete.mp3',
    rateRange: [0.9, 1.1],
    volumeRange: [0.9, 1.0],
    panJitter: 0.08,
  },
  snapshotCapture: {
    src: '/audios/sfx/snapshot_capture.mp3',
  },
  menuHover: {
    src: '/audios/sfx/menu_hover.mp3',
    rateRange: [0.98, 1.02],
    volumeRange: [0.2, 0.3],
    panJitter: 0.1,
    minIntervalMs: 0,
  },
  menuClick: {
    src: '/audios/sfx/menu_click.mp3',
    rateRange: [0.98, 1.02],
    volumeRange: [0.5, 0.6],
    panJitter: 0.1,
  },
  paintApply: {
    src: '/audios/sfx/paint_apply.mp3',
    rateRange: [0.95, 1.05],
    volumeRange: [0.85, 1.0],
    panJitter: 0.12,
    minIntervalMs: 60,
  },
} as const

export type SFXName = keyof typeof SFX

/**
 * Studio SFX are disabled — keep the API so call sites stay intact.
 */
export function playSFX(_name: SFXName) {}

/**
 * No-op while SFX playback is disabled.
 */
export function updateSFXVolumes() {}
