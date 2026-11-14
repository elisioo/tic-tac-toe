# Cosmic Clash

A tic-tac-toe game by Eli.

A space-themed game for two local players, built with Next.js, React, Tailwind CSS 4, and shadcn/ui-compatible components. Astro plays as X with rocket pieces, and UFO plays as O with alien spaceship pieces.

## Features

- Centered game board with UFO on the left and Astro on the right on desktop.
- Character turn indicators: the active character enlarges and its platform glows.
- Responsive layout with both characters above the board on smaller screens.
- Full-page space video background with muted, looping autoplay.
- Automatic win and draw detection, with highlighted winning sectors.
- Character-specific winner images centered over the board, with glowing rays, floating animation, and celebratory sparks.
- Round counter and scoreboard for both players and draws.
- Keyboard-accessible board buttons, live result announcements, and reduced-motion styles for CSS effects.
- Local assets with no API keys required.

## Getting started

Install a Node.js version compatible with Next.js 16, then run:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser. If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`.

## How to play

1. Astro (X) goes first. Select an empty sector to place a piece.
2. Take turns on the same device. The enlarged, glowing character indicates the current player.
3. Connect three pieces horizontally, vertically, or diagonally to win. A full board without a winner is a draw.
4. Select **New Game** to start another round and keep the scores.
5. Select **Reset All Scores** to clear the scores, reset the round counter, and start a fresh board.

Scores and rounds are stored in memory and reset when the page reloads.

## Validation and production

```bash
npm test
npm run build
npm start
```

`npm test` runs the game logic tests for winning lines, draws, valid moves, and blocking moves after a win. `npm run build` creates the production build; `npm start` serves that build.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/page.jsx` | Game screen, player characters, turn indicators, winner display, and scoreboard |
| `app/globals.css` | Theme, responsive layout, and visual effects |
| `app/layout.jsx` | Page metadata and root layout |
| `app/icon.svg` | Rocket favicon |
| `components/ui/` | Reusable Button, Badge, and Card components |
| `lib/game.mjs` | Pure tic-tac-toe rules |
| `lib/game.test.mjs` | Game logic tests |
| `public/characters/` | Astro, UFO, and winner images served by the app |
| `public/vid/space_bg.mp4` | Space video background served by the app |

## Character assets

The page uses these files from `public/characters/`:

- `astro.png`: Astro turn indicator.
- `ufo.png`: UFO turn indicator.
- `winner_astro.png`: Celebration image when Astro wins.
- `winner_ufo.png`: Celebration image when UFO wins.
- `draw.png`: Centered result image when a round ends in a draw.

Replace these files to customize the artwork while keeping the same filenames. Board pieces use inline SVG illustrations in `app/page.jsx`.

## Deployment

Import the repository into a Next.js-compatible hosting service such as Vercel. Use `npm run build` as the build command and keep the framework defaults. Include the `public/` assets; exclude generated folders such as `node_modules/` and `.next/`.
