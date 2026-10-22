# Tonal Field — project context

## What it is
Tonal Field is an ear-training web app. It's a single self-contained file
(`index.html`, originally `tonal-field.html`) with inline CSS and JS, no build step
and no dependencies. The only external resources are Google Fonts (Unbounded, Sora,
VT323, Space Mono). All sound is synthesized live with the Web Audio API; there are
no audio files.

## Goal
Keep improving it, and run it as an app on my phone: hosted on GitHub Pages, added
to my home screen as an installable PWA with offline support.

## Repo layout
- `index.html` — the whole app.
- `manifest.webmanifest`, `icons/` — PWA install metadata and icons.
- `sw.js` — service worker: caches the app shell and Google Fonts for offline use.
  **Bump `VERSION` in `sw.js` whenever `index.html` or the icons change**, or phones
  keep serving the old cached copy.
- The manifest and service-worker tags live in `index.html` (`<head>` and just before `</body>`).

## Modes (tabs, beginner to advanced)
1. Degrees: a drone/cadence sets the key, then one note plays; identify the scale
   degree on a 12-position circle (1 3 5 / scale / all 12; major or minor; 1–2 octaves).
2. Chord quality: maj, min, dim, aug, plus optional maj7, 7, m7, ø7, °7, played as
   block chord, arpeggio, or both.
3. Chords in a key: a cadence sets the key, then 1–4 chords play; answer with Roman
   numerals placed on the circle at their root's position. Major-key groups: diatonic
   triads and sevenths, borrowed, secondary dominants. Minor-key groups: natural minor,
   harmonic dominants, sevenths, color chords (Dorian IV, ♭II, Picardy I).
   Optional step for single chords: type the chord name (e.g. F#m, Bb7). Spelling is
   checked; enharmonic answers get "right sound, spelled X".
4. Find the key: inspired by Sonofield's Key Seeker. 24 procedurally generated looping
   songs in four styles, difficulty 1–5. Hold piano keys to test notes, pick maj/min,
   then check. Song dots sit in a ring around the circle.

## Other features
- Stats with confusion tracking; weaker items come up more often.
- Pocket mode: hands-free, speaks the answers using speech synthesis.
- Free play: tap a chord or degree between questions to hear it.
- Settings and stats are saved in localStorage (wrapped in try/catch).
- Keyboard shortcuts for every mode, listed in the "?" help panel.

## Themes (one toggle button in the header)
- Interstellar: a black hole at the circle's center (corona, swirling accretion
  streaks, and a photon ring that doubles as the live waveform). Slow hyperspace-style
  star streaks emerge from the hole. A correct answer sends a blue pulse ring out from
  the center plus a gentle warp surge; a wrong answer sends an orange pulse.
  Default sound is a glassy pad.
- Pocket radio: a retro 3D handheld device ("TF-64"). Scanlined screen with a pixel
  sine-wave scope that blinks blue (right) or orange (wrong), a raised dial knob with
  an orange needle, and a speaker grille. Default sound is pure sine waves.
- Both themes have light and dark variants that follow the device setting.

## Design rules
- Palette is blue, gray and orange. Blue means correct, orange means wrong, everywhere.
- Minimal and clean, like Sonofield. Mostly bare text, not boxed buttons.
- Everything must fit on one screen with no scrolling. The circle resizes to the
  available height.
- No overlapping text, at any screen size, in either theme.
- Settings live in a slide-out panel behind the gear icon; help lives behind "?".
- Abbreviate quality names (maj, min, dim, aug).

## Ideas not yet built
- Sampled instrument sounds.
- Real-song excerpts for Find the key.
- Syncing progress between devices.
