# Tonal Field

An ear-training app: scale degrees, chord qualities, chords in a key, and find the key.
One self-contained HTML file, all sound synthesized with the Web Audio API.

## Run it on your phone
1. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`, **Save**.
2. After a minute it's live at `https://lehoffenberger.github.io/tonal-field/`.
3. Open that link on your phone:
   - **iPhone (Safari):** Share → **Add to Home Screen**.
   - **Android (Chrome):** menu → **Install app** / **Add to Home screen**.
4. Open it once while online; after that it works offline.

## Updating
Edit `index.html`, bump `VERSION` in `sw.js`, push. The phone picks up the new
version the next time the app is opened online (sometimes it takes a second launch).

## Credits
- Piano: [Salamander Grand Piano V3](https://archive.org/details/SalamanderGrandPianoV3) by Alexander Holm,
  CC BY 3.0, via the `@audio-samples/piano-mp3-velocity8` package (MIT). Trimmed to mono clips in `piano/`.
- Spoken answers in `voice/`: generated with [Flite](http://www.festvox.org/flite/) (CMU, BSD-style license), voice "slt".
