# Audio credits

Every file shipped in `public/sounds/`, where it came from, and under which
licence. Keep this current: re-encoding strips ID3 tags, so this file is the
only record of provenance once a track is in the repo.

## Ambient sounds

| File | Source | Author | Licence | Attribution required |
|---|---|---|---|---|
| `rain.mp3` | ["Amb_Forest_Thunder_Rain_Night_KA"](https://freesound.org/s/728687/), Freesound | Kristoffer_Andersson | CC0 1.0 | No |
| `forest.mp3` | ["Réveil des oiseaux"](https://commons.wikimedia.org/wiki/File:R%C3%A9veil_des_oiseaux.ogg), Wikimedia Commons | Joseph Sardin | CC0 1.0 | No |
| `fireplace.mp3` | ["Lit Fireplace"](https://freesound.org/people/lurpsis/sounds/444127), Freesound | lurpsis | CC0 1.0 | No |
| `cafe.mp3` | Generated with Suno | — | Suno paid subscription, commercial use | No |
| `lofi.mp3`, `lofi-crackle-loop-drift.mp3`, `lofi-loop-in-dust.mp3`, `lofi-repeat-in-the-dust.mp3` | Generated with Suno | — | Suno paid subscription, commercial use | No |

## Alarm and interface sounds

`alarm-gentle.mp3`, `alarm-classic.mp3`, `alarm-bell.mp3`, `tick-start.mp3` —
original creations.

## Licence rule for new ambient sounds

Commercial use must be unambiguous. **CC0** and **CC BY** only. Never
**CC BY-NC** or any other non-commercial clause: the pre-July-2026 ambient
tracks were CC BY-NC 4.0, which is what forced the switch to generated audio in
`2a17704`. Also avoid Freesound's legacy "Sampling+" licence and the BBC Sound
Effects library (RemArc licence, personal and educational use only).

## Processing applied

Sources were trimmed to a loopable stretch and level-matched to the existing
tracks (median RMS around -17 dBFS, measured against `cafe.mp3` and `lofi.mp3`)
so all five ambients mix at the same slider position. Rain is the one
exception: it is a night rain carrying thunder, and lifting its bed all the
way to the others would have cost most of the thunder to the limiter, so it
sits about 3 dB lower and keeps its dynamics. Its loop is audible on a long
session because thunder is an identifiable event; that was a deliberate call. Static gain, not
`loudnorm`, whose dynamic normalisation would flatten the texture. A limiter
with roughly 3 dB of headroom runs only on the tracks that needed a positive
gain, absorbing the inter-sample overshoot MP3 encoding adds; decoded peaks stay
below 0 dBFS. Encoded at 128 kbps stereo to match the rest of the folder.

No fades were applied to the file edges on purpose: `useSound.ts` crossfades each
ambient with a second copy of itself over 0.5 s, and edge fades would dip the
volume at the loop point instead of hiding it.
