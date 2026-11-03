# Guide-Moi

Slug `guide-moi` · 10 pictures in `public/assets/guide-moi/`, served at `/assets/guide-moi/<file>`.
Consultancy, not development: the owner helped the team with the initial system design and architecture.
A phone-only app, in French, for travellers in Québec. No case study or live site; the text comes
from the owner's words and the screens. Year 2025 (the screens are dated January 2025) is still to
be confirmed with the owner.

| file | pixels | used for | from |
|---|---|---|---|
| welcome.png | 783x1610 | hero | `landing.png`, without the grey sliver in its top 4 rows; a portrait hero gets rounded corners and a hairline on the page |
| home.png | 779x1687 | phone, first (held longest) | `trips.png` |
| trip-form.png | 777x1682 | phone 2 and moving row | `form.png` |
| interests.png | 778x1685 | phone 3 and moving row | `pills.png` |
| suggestion.webp | 784x1698 | phone 4 and moving row | `chatWithComp.png`, WebP at 98% (a photo) |
| taxi.webp | 769x1665 | phone 5 and moving row | `chatWithMap.png`, WebP at 98% (a map) |
| new-trip.png | 779x1687 | moving row | `startTrip.png` |
| voice-input.png | 762x1650 | moving row | `transcription.png` |
| weather.png | 764x1654 | moving row | `weatherCard.png` |
| thumbnail.png | 779x779 | previews | `trips.png`: the green header and the current trip, cut square at full resolution; the owner's `thumbnail.png` is an enlarged 4:3 crop of the same view |

The owner's screens are cropped captures without a status bar, each a slightly different
size. In the phone they all fill one screen shape, the iPhone shape of the Startir screens
(750:1624), so each got (`guidemoi.py` recipe):

- its rounded-corner remnants set on white, where they sit on white;
- a status-bar strip on top, 5.4% of its height, repeating its own top row (a flat strip of the
  header's colour on the home screen, whose icon pattern runs off the top edge), so the phone's
  camera island sits above the app's header, as on a real phone;
- the exact shape, by adding or removing a few rows spread through runs of identical rows (blank
  gaps), never through content: the transcription keyboard's keys touch both edges, and the
  weather sheet's rounded corners sit on them, so no screen is widened.

Nothing is redrawn or scaled. Every original is kept in `originals/public/assets/guide-moi/`.
