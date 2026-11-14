export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

/** Pure game logic, kept separate so the win/draw rules can be tested. */
export function evaluateBoard(board) {
  if (!Array.isArray(board) || board.length !== 9) {
    throw new Error('Tic-Tac-Toe requires exactly nine cells.');
  }
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningCells: line, isDraw: false };
    }
  }
  return {
    winner: null,
    winningCells: [],
    isDraw: board.every(Boolean)
  };
}

export function applyMove(board, index, mark) {
  const { winner, isDraw } = evaluateBoard(board);
  if (!Number.isInteger(index) || index < 0 || index > 8 || board[index] || winner || isDraw) {
    return board;
  }
  const next = [...board];
  next[index] = mark;
  return next;
}
