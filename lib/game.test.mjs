import test from 'node:test';
import assert from 'node:assert/strict';
import { applyMove, evaluateBoard, WINNING_LINES } from './game.mjs';

test('an empty board is not a winner or a draw', () => {
  assert.deepEqual(evaluateBoard(Array(9).fill(null)), { winner: null, winningCells: [], isDraw: false });
});

test('all eight winning lines work', () => {
  for (const line of WINNING_LINES) {
    const board = Array(9).fill(null);
    for (const index of line) board[index] = 'X';
    const state = evaluateBoard(board);
    assert.equal(state.winner, 'X');
    assert.deepEqual(state.winningCells, line);
  }
});

test('O can win', () => {
  const board = ['O', 'X', 'X', null, 'O', 'X', null, null, 'O'];
  assert.equal(evaluateBoard(board).winner, 'O');
});

test('a full board without a winner is a draw', () => {
  const board = ['X','O','X','X','O','O','O','X','X'];
  assert.equal(evaluateBoard(board).isDraw, true);
});

test('a mark is placed only in a valid empty cell', () => {
  const board = Array(9).fill(null);
  const once = applyMove(board, 4, 'X');
  assert.equal(board[4], null);
  assert.equal(once[4], 'X');
  assert.equal(applyMove(once, 4, 'O'), once);
});

test('no moves are accepted after a win', () => {
  const won = ['X', 'X', 'X', null, 'O', null, null, 'O', null];
  assert.equal(applyMove(won, 8, 'O'), won);
});
