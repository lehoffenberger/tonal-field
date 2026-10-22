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
0. Intervals: two notes (up, down, both, or together); name the interval on the circle
   (P4 P5 P8 / major scale / all 12). Feedback includes a reference song.
1. Degrees: a drone/cadence sets the key, then one note plays; identify the scale
   degree on a 12-position circle (1 3 5 / scale / all 12; major or minor; 1–2 octaves).
   "Notes per question" 2–4 turns it into melodic dictation (answer in order, with Undo).
2. Chord quality: maj, min, dim, aug, plus optional maj7, 7, m7, ø7, °7, played as
   block chord, arpeggio, or both.
3. Chords in a key: a cadence sets the key, then 1–4 chords play; answer with Roman
   numerals placed on the circle at their root's position. Major-key groups: diatonic
   triads and sevenths, borrowed, secondary dominants. Minor-key groups: natural minor,
   harmonic dominants, sevenths, color chords (Dorian IV, ♭II, Picardy I).
   Optional step for single chords: type the chord name (e.g. F#m, Bb7). Spelling is
   checked; enharmonic answers get "right sound, spelled X".
   Multi-chord questions are "Musical" by default (built from harmonic function:
   tonic → predominant → dominant, secondaries resolve to their target) or "Random".
4. Find the key: inspired by Sonofield's Key Seeker. 24 procedurally generated looping
   songs in four styles, difficulty 1–5. Tap/hold piano keys to test notes; double-tap
   (or press a key twice) to choose home; pick maj/min, then check. Each visit moves the
   song to a random key (setting). Difficulty filter, tempo, random song in Settings.
   Song dots sit in a ring around the circle.

## Other features
- Stats with confusion tracking. Weighting uses each item's last 20 tries (`h` array),
  so learned items stop coming up; no back-to-back repeats when 4+ items are on.
- Weak-spots practice (Settings) and session goals (10/25/50) with an end summary and
  "Practice these". Score in the header shows right/answered, goal left, streak.
- Tap the circle to start or go to the next question; optional auto-advance.
- Vibration on answers (Android), screen kept awake in Pocket mode.
- Backup in Settings: copy/paste or save/load a JSON of settings + stats. On iPhone,
  Safari and the home-screen app have separate storage.
- iOS: `navigator.audioSession.type='playback'` so sound ignores the silent switch; the
  AudioContext is resumed from any non-running state (calls, app switching).
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
- Palette is blue, gray and orange. Blue means correct, orange means wrong for answer
  feedback. Orange is also the decorative accent (black hole glow, radio needle, radio
  buttons, selection marks); the owner likes it and doesn't find it confusing.
- As little text as possible on the main screen. No routine prompts: the center shows
  the key name and, after answering, the answer big in blue/orange. Controls are icon
  buttons (replay, hear the key, undo, resolve home, next) with aria-labels; a ▶ in the
  center starts. Feedback is one line (your answer struck through → the right one); the
  "feel" sentence shows only after a miss. Explanations belong in the "?" help panel.
- Minimal and clean, like Sonofield. Mostly bare text, not boxed buttons.
- Everything must fit on one screen with no scrolling. The circle resizes to the
  available height. Landscape on phones puts the circle left and controls right.
- Tap targets are at least 44px; tabs use short labels under 700px wide.
- Circle labels must pop: Interstellar gives them a halo in the background color and
  fades star streaks behind them; the radio engraves them, large, on the dial.
- The radio dial nearly fills the device; landscape centers the dial + controls pair.
- Piano keys: no text selection or callouts (-webkit-user-select / -webkit-touch-callout),
  touch defaults blocked (stops iOS double-tap zoom), and any finger lift, blur or app
  switch releases held notes.
- No overlapping text, at any screen size, in either theme.
- Settings live in a slide-out panel behind the gear icon; help lives behind "?".
- Abbreviate quality names (maj, min, dim, aug).

## Testing
Serve the folder (`python3 -m http.server`) and drive it with Playwright using
`executablePath: '/opt/pw-browsers/chromium'`. Check both themes, light and dark, at
320×568, 375×667, 390×844, 430×932 and landscape 844×390 / 667×375 for text overlap,
clipping and page growth. CSS gotcha: narrow-phone overrides live at the end of the
stylesheet so later base rules don't silently beat them.

## Ideas not yet built
- Sampled instrument sounds.
- Real-song excerpts for Find the key.
- Syncing progress between devices.
