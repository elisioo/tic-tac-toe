"use client";

import { useMemo, useState } from "react";
import { applyMove, evaluateBoard } from "../lib/game.mjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const INITIAL = Array(9).fill(null);
const CONSTELLATIONS = [
  [6, 14, 2],
  [14, 39, 1],
  [21, 6, 2],
  [27, 71, 1],
  [39, 19, 2],
  [48, 81, 1],
  [56, 8, 2],
  [68, 50, 1],
  [77, 21, 2],
  [84, 77, 1],
  [89, 43, 2],
  [96, 9, 1],
  [13, 87, 1],
  [75, 92, 2],
];
const SPARKS = Array.from({ length: 18 }, (_, i) => ({
  left: `${7 + ((i * 41) % 87)}%`,
  top: `${8 + ((i * 19) % 70)}%`,
  delay: `${(i % 6) * 0.075}s`,
  color: ["#84e8fc", "#f8d17b", "#e28dff", "#effdff"][i % 4],
}));

function RocketIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 110"
      fill="none"
      role="img"
      aria-label="Human rocket spaceship"
    >
      <path
        d="M50 10C65 24 69 43 68 68H32C31 43 35 24 50 10Z"
        fill="#ECF5FF"
        stroke="#13253F"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M50 10C56 15 60 22 63 28H37C40 22 44 15 50 10Z"
        fill="#FF7F91"
        stroke="#13253F"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M32 51 17 64 14 84 34 72Z"
        fill="#70DAF0"
        stroke="#13253F"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M68 51 83 64 86 84 66 72Z"
        fill="#70DAF0"
        stroke="#13253F"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle
        cx="50"
        cy="43"
        r="10"
        fill="#53BEE8"
        stroke="#13253F"
        strokeWidth="3"
      />
      <path
        d="M34 69H66V76H34Z"
        fill="#FF7F91"
        stroke="#13253F"
        strokeWidth="3"
      />
      <path
        d="M42 79C40 89 43 97 49 105 55 97 59 88 57 79"
        fill="#FFB55A"
        stroke="#F07868"
        strokeWidth="2.5"
      />
      <path
        d="M47 81V99"
        stroke="#FFF3B5"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UfoIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 110 100"
      fill="none"
      role="img"
      aria-label="Alien spaceship"
    >
      <path
        d="M31 53C31 30 42 14 55 14S79 30 79 53"
        fill="#99F0AC"
        stroke="#15223A"
        strokeWidth="3.5"
      />
      <path d="M42 44C42 34 47 30 55 30S68 34 68 44" fill="#4FA887" />
      <ellipse
        cx="49"
        cy="42"
        rx="3.2"
        ry="5"
        fill="#15223A"
        transform="rotate(-12 49 42)"
      />
      <ellipse
        cx="61"
        cy="42"
        rx="3.2"
        ry="5"
        fill="#15223A"
        transform="rotate(12 61 42)"
      />
      <path
        d="M13 60C24 50 37 48 55 48S87 50 97 60C90 76 73 82 55 82S20 76 13 60Z"
        fill="#B99AFF"
        stroke="#15223A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <ellipse
        cx="55"
        cy="59"
        rx="44"
        ry="12"
        fill="#E7D9FF"
        stroke="#15223A"
        strokeWidth="3.5"
      />
      <circle cx="30" cy="61" r="4" fill="#FFCF64" />
      <circle cx="55" cy="65" r="4" fill="#9EF6CE" />
      <circle cx="80" cy="61" r="4" fill="#FFCF64" />
      <path
        d="M40 83 33 94M70 83 77 94"
        stroke="#85EDCA"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M18 1.5 22.6 13.5 34.5 18l-11.9 4.5L18 34.5l-4.6-12L1.5 18l11.9-4.5L18 1.5Z"
        stroke="currentColor"
        strokeWidth="2.4"
        fill="currentColor"
      />
    </svg>
  );
}

function TurnCharacter({ player, active, winner, isDraw }) {
  const name = player === "X" ? "Astro" : "UFO";
  const highlighted = !isDraw && active === player;
  return (
    <div className={`turn-character character-${player.toLowerCase()} ${highlighted ? "character-active" : ""}`}>
      <div className="character-stage">
        <img src={`/characters/${name.toLowerCase()}.png`} alt={name} className="character-image" />
        <span className="character-platform" aria-hidden="true" />
      </div>
      <span className="character-player">PLAYER {player}</span>
      <h2>{name}</h2>
      <span className="character-caption">{isDraw ? "DRAW" : winner === player ? "WINNER!" : winner ? "NEXT TIME" : highlighted ? "YOUR TURN" : "STANDING BY"}</span>
    </div>
  );
}

const LABELS = { X: "Astro", O: "UFO" };

export default function Home() {
  const [board, setBoard] = useState(INITIAL);
  const [turn, setTurn] = useState("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [round, setRound] = useState(1);

  const { winner, winningCells, isDraw } = useMemo(
    () => evaluateBoard(board),
    [board],
  );
  const gameOver = Boolean(winner || isDraw);
  const active = winner || turn;

  function play(index) {
    if (gameOver || board[index]) return;
    const next = applyMove(board, index, turn);
    if (next === board) return;
    const result = evaluateBoard(next);
    setBoard(next);
    if (result.winner) {
      setScores((current) => ({
        ...current,
        [result.winner]: current[result.winner] + 1,
      }));
    } else if (result.isDraw) {
      setScores((current) => ({ ...current, draws: current.draws + 1 }));
    } else {
      setTurn((current) => (current === "X" ? "O" : "X"));
    }
  }

  function newGame() {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setRound((current) => current + 1);
  }

  function resetScores() {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setScores({ X: 0, O: 0, draws: 0 });
    setRound(1);
  }

  return (
    <main className="cosmos">
      <video
        className="space-background"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/vid/space_bg.mp4" type="video/mp4" />
      </video>
      <div className="space-background-overlay" aria-hidden="true" />
      <div className="starfield" aria-hidden="true" />
      <div className="orb orb-left" aria-hidden="true" />
      <div className="orb orb-right" aria-hidden="true" />
      <div className="stars" aria-hidden="true">
        {CONSTELLATIONS.map(([x, y, size], index) => (
          <i
            key={index}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size + 1}px`,
              height: `${size + 1}px`,
              animationDelay: `${index * 0.25}s`,
            }}
          />
        ))}
      </div>

      <div className="container">
        <header className="match-header">
          <p>THE GALACTIC SHOWDOWN</p>
          <h1>Cosmic <span>Clash</span></h1>
          <p className="creator-credit">a tic-tac-toe game by Eli</p>
        </header>
        <section className="arena character-arena" aria-label="Cosmic Clash Tic-Tac-Toe">
          <TurnCharacter player="O" active={active} winner={winner} isDraw={isDraw} />

          <div id="game" className="board-column">
            <div className="orbit-ring orbit-ring-one" aria-hidden="true" />
            <div className="orbit-ring orbit-ring-two" aria-hidden="true" />
            <Card className="game-panel gap-0">
              <div className="game-panel-top">
                <Badge variant="secondary" className="panel-badge">
                  <span className="panel-badge-glow" /> LIVE MATCH
                </Badge>
                <span className="round-counter">
                  ROUND {String(round).padStart(2, "0")} <span> / ∞</span>
                </span>
              </div>
              <div className="panel-heading">
                <h2>GALACTIC GRID</h2>
                <span>3 × 3 SECTORS</span>
              </div>
              <div className={`board-wrap ${winner ? "board-victory" : ""}`}>
                {winner && (
                  <div className={`victory-display victory-${winner.toLowerCase()}`}>
                    <div className="victory-rays" aria-hidden="true" />
                    <span className="victory-label">GALACTIC CHAMPION</span>
                    <img
                      className="victory-image"
                      src={`/characters/winner_${winner === "X" ? "astro" : "ufo"}.png`}
                      alt={`${LABELS[winner]} celebrating victory`}
                    />
                    <strong>{LABELS[winner]} wins!</strong>
                  </div>
                )}
                {winner && (
                  <div className="burst" aria-hidden="true">
                    {SPARKS.map((spark, i) => (
                      <span
                        key={i}
                        style={{
                          left: spark.left,
                          top: spark.top,
                          backgroundColor: spark.color,
                          animationDelay: spark.delay,
                        }}
                      />
                    ))}
                  </div>
                )}
                <div
                  className="board"
                  role="group"
                  aria-label="Tic Tac Toe board, three rows and three columns"
                >
                  {board.map((mark, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`sector ${mark ? `sector-${mark.toLowerCase()}` : ""} ${winningCells.includes(index) ? "sector-winning" : ""}`}
                      aria-label={`Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}: ${mark ? `Player ${mark} ${LABELS[mark]}` : "empty"}`}
                      disabled={Boolean(mark) || gameOver}
                      onClick={() => play(index)}
                    >
                      {mark === "X" && (
                        <RocketIcon className="piece rocket-piece" />
                      )}
                      {mark === "O" && <UfoIcon className="piece ufo-piece" />}
                      {!mark && (
                        <span aria-hidden="true" className="sector-target">
                          +
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <p className="match-announcement" role="status" aria-live="polite" aria-atomic="true">
                {winner ? `${LABELS[winner]} wins the galaxy!` : isDraw ? "It's a cosmic draw!" : `${LABELS[turn]}'s turn`}
              </p>
              <Button type="button" className="new-game" onClick={newGame}>
                <span className="new-game-icon">↻</span> NEW GAME{" "}
                <span className="new-game-arrow">↗</span>
              </Button>
            </Card>
          </div>
          <TurnCharacter player="X" active={active} winner={winner} isDraw={isDraw} />
        </section>

        <section className="scoreboard" aria-label="Scoreboard">
          <div className="scoreboard-heading">
            <span>FLIGHT RECORDS</span>
            <span className="scoreboard-line" />
            <span>ALL ROUNDS</span>
          </div>
          <div className="score-grid">
            <Card className="score-tile score-rocket gap-0">
              <div className="score-top">
                <span className="score-emoji">
                  <RocketIcon />
                </span>{" "}
                HUMAN FLEET <span className="score-id">X</span>
              </div>
              <div className="score-count">
                {scores.X}
                <span>WINS</span>
              </div>
            </Card>
            <Card className="score-tile score-draw gap-0">
              <div className="score-top">
                <span className="score-emoji score-star">
                  <StarIcon />
                </span>{" "}
                NEUTRAL ZONE <span className="score-id">—</span>
              </div>
              <div className="score-count">
                {scores.draws}
                <span>DRAWS</span>
              </div>
            </Card>
            <Card className="score-tile score-ufo gap-0">
              <div className="score-top">
                <span className="score-emoji">
                  <UfoIcon />
                </span>{" "}
                ALIEN FLEET <span className="score-id">O</span>
              </div>
              <div className="score-count">
                {scores.O}
                <span>WINS</span>
              </div>
            </Card>
          </div>
          <div className="score-footer">
            <p>FIRST TO THREE IN A ROW CLAIMS THE GALAXY.</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetScores}
            >
              RESET ALL SCORES <span aria-hidden="true">↗</span>
            </Button>
          </div>
        </section>
        <footer className="footer">
          <span>✳</span>
          COSMIC CLASH
          <span className="footer-separator">·</span> MADE FOR EARTHLINGS &
          EVERYONE ELSE <span>✳</span>
        </footer>
      </div>
    </main>
  );
}
