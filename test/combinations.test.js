'use strict';

const chai = require('chai');

const assert = chai.assert;
chai.use(require('chai-string'));

const Board = require('../classes/board.js');

describe('Combinations', function() {
	let board = new Board();

	afterEach(function() {
		board = new Board();
	});

	describe('#Inner Squares', function() {
		describe('Player 1', function() {
			innerWins('_A1', 'X');
		});

		describe('Player 2', function() {
			innerWins('_A1', 'O');
		});

		it('Tie', function() {
			board._A1._X1 = 'O';
			board._A1._X2 = 'X';
			board._A1._X3 = 'O';
			board._A1._Y1 = 'O';
			board._A1._Y2 = 'X';
			board._A1._Y3 = 'X';
			board._A1._Z1 = 'X';
			board._A1._Z2 = 'O';
			board._A1._Z3 = 'O';
			board._A1.checkWins();
			return assert.equal(board._A1._winner, 'tie', 'board._A1._winner equals \'tie\'');
		});

		function innerWins(boardSquare, player) {
			it(`X1, X2, X3: ${(player === 'X') ? 'player 1' : 'player 2'} wins square`, function() {
				board[boardSquare]._X1 = player;
				board[boardSquare]._X2 = player;
				board[boardSquare]._X3 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winner, player, `board.${boardSquare} equals ${player}`);
			});

			it(`Y1, Y2, Y3: ${(player === 'X') ? 'player 1' : 'player 2'} wins square`, function() {
				board[boardSquare]._Y1 = player;
				board[boardSquare]._Y2 = player;
				board[boardSquare]._Y3 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winner, player, `board.${boardSquare} equals ${player}`);
			});

			it(`Z1, Z2, Z3: ${(player === 'X') ? 'player 1' : 'player 2'} wins square`, function() {
				board[boardSquare]._Z1 = player;
				board[boardSquare]._Z2 = player;
				board[boardSquare]._Z3 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winner, player, `board.${boardSquare} equals ${player}`);
			});

			it(`X1, Y1, Z1: ${(player === 'X') ? 'player 1' : 'player 2'} wins square`, function() {
				board[boardSquare]._X1 = player;
				board[boardSquare]._Y1 = player;
				board[boardSquare]._Z1 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winner, player, `board.${boardSquare} equals ${player}`);
			});

			it(`X2, Y2, Z2: ${(player === 'X') ? 'player 1' : 'player 2'} wins square`, function() {
				board[boardSquare]._X2 = player;
				board[boardSquare]._Y2 = player;
				board[boardSquare]._Z2 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winner, player, `board.${boardSquare} equals ${player}`);
			});

			it(`X3, Y3, Z3: ${(player === 'X') ? 'player 1' : 'player 2'} wins square`, function() {
				board[boardSquare]._X3 = player;
				board[boardSquare]._Y3 = player;
				board[boardSquare]._Z3 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winner, player, `board.${boardSquare} equals ${player}`);
			});

			it(`X1, Y2, Z3: ${(player === 'X') ? 'player 1' : 'player 2'} wins square`, function() {
				board[boardSquare]._X1 = player;
				board[boardSquare]._Y2 = player;
				board[boardSquare]._Z3 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winner, player, `board.${boardSquare} equals ${player}`);
			});

			it(`X3, Y2, Z1: ${(player === 'X') ? 'player 1' : 'player 2'} wins square`, function() {
				board[boardSquare]._X3 = player;
				board[boardSquare]._Y2 = player;
				board[boardSquare]._Z1 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winner, player, `board.${boardSquare} equals ${player}`);
			});

			// Winning combinations

			it('X1, X2, X3: Correct winning combination', function() {
				board[boardSquare]._X1 = player;
				board[boardSquare]._X2 = player;
				board[boardSquare]._X3 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winningCombination, 'X1X3VVS', `board.${boardSquare} has correct winningCombination code.`);
			});

			it('Y1, Y2, Y3: Correct winning combination', function() {
				board[boardSquare]._Y1 = player;
				board[boardSquare]._Y2 = player;
				board[boardSquare]._Y3 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winningCombination, 'Y1Y3VVS', `board.${boardSquare} has correct winningCombination code.`);
			});

			it('Z1, Z2, Z3: Correct winning combination', function() {
				board[boardSquare]._Z1 = player;
				board[boardSquare]._Z2 = player;
				board[boardSquare]._Z3 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winningCombination, 'Z1Z3VVS', `board.${boardSquare} has correct winningCombination code.`);
			});

			it('X1, Y1, Z1: Correct winning combination', function() {
				board[boardSquare]._X1 = player;
				board[boardSquare]._Y1 = player;
				board[boardSquare]._Z1 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winningCombination, 'X1Z1HHS', `board.${boardSquare} has correct winningCombination code.`);
			});

			it('X2, Y2, Z2: Correct winning combination', function() {
				board[boardSquare]._X2 = player;
				board[boardSquare]._Y2 = player;
				board[boardSquare]._Z2 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winningCombination, 'X2Z2HHS', `board.${boardSquare} has correct winningCombination code.`);
			});

			it('X3, Y3, Z3: Correct winning combination', function() {
				board[boardSquare]._X3 = player;
				board[boardSquare]._Y3 = player;
				board[boardSquare]._Z3 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winningCombination, 'X3Z3HHS', `board.${boardSquare} has correct winningCombination code.`);
			});

			it('X1, Y2, Z3: Correct winning combination', function() {
				board[boardSquare]._X1 = player;
				board[boardSquare]._Y2 = player;
				board[boardSquare]._Z3 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winningCombination, 'X1Z3DBS', `board.${boardSquare} has correct winningCombination code.`);
			});

			it('X3, Y2, Z1: Correct winning combination', function() {
				board[boardSquare]._X3 = player;
				board[boardSquare]._Y2 = player;
				board[boardSquare]._Z1 = player;
				board[boardSquare].checkWins();
				return assert.equal(board[boardSquare]._winningCombination, 'X3Z1DFS', `board.${boardSquare} has correct winningCombination code.`);
			});
		}
	});

	describe('#Board Squares', function() {
		describe('Player 1', function() {
			boardWins('X');
		});

		describe('Player 2', function() {
			boardWins('O');
		});

		it('Tie', function() {
			board._A1 = 'O';
			board._A2 = 'X';
			board._A3 = 'O';
			board._B1 = 'O';
			board._B2 = 'X';
			board._B3 = 'X';
			board._C1 = 'X';
			board._C2 = 'O';
			board._C3 = 'O';
			board.gameWon();
			return assert.equal(board._winner, 'tie', 'board._winner equals \'tie\'');
		});

		function boardWins(player) {
			it(`A1, A2, A3: ${(player === 'X') ? 'player 1' : 'player 2'} wins game`, function() {
				board._A1._winner = player;
				board._A2._winner = player;
				board._A3._winner = player;
				board.gameWon();
				return assert.startsWith(board._winner, player, `board._winner starts with ${player}`);
			});

			it(`B1, B2, B3: ${(player === 'X') ? 'player 1' : 'player 2'} wins game`, function() {
				board._B1._winner = player;
				board._B2._winner = player;
				board._B3._winner = player;
				board.gameWon();
				return assert.startsWith(board._winner, player, `board._winner starts with ${player}`);
			});

			it(`C1, C2, C3: ${(player === 'X') ? 'player 1' : 'player 2'} wins game`, function() {
				board._C1._winner = player;
				board._C2._winner = player;
				board._C3._winner = player;
				board.gameWon();
				return assert.startsWith(board._winner, player, `board._winner starts with ${player}`);
			});

			it(`A1, B1, C1: ${(player === 'X') ? 'player 1' : 'player 2'} wins game`, function() {
				board._A1._winner = player;
				board._B1._winner = player;
				board._C1._winner = player;
				board.gameWon();
				return assert.startsWith(board._winner, player, `board._winner starts with ${player}`);
			});

			it(`A2, B2, C2: ${(player === 'X') ? 'player 1' : 'player 2'} wins game`, function() {
				board._A2._winner = player;
				board._B2._winner = player;
				board._C2._winner = player;
				board.gameWon();
				return assert.startsWith(board._winner, player, `board._winner starts with ${player}`);
			});

			it(`A3, B3, C3: ${(player === 'X') ? 'player 1' : 'player 2'} wins game`, function() {
				board._A3._winner = player;
				board._B3._winner = player;
				board._C3._winner = player;
				board.gameWon();
				return assert.startsWith(board._winner, player, `board._winner starts with ${player}`);
			});

			it(`A1, B2, C3: ${(player === 'X') ? 'player 1' : 'player 2'} wins game`, function() {
				board._A1._winner = player;
				board._B2._winner = player;
				board._C3._winner = player;
				board.gameWon();
				return assert.startsWith(board._winner, player, `board._winner starts with ${player}`);
			});

			it(`A3, B2, C1: ${(player === 'X') ? 'player 1' : 'player 2'} wins game`, function() {
				board._A3._winner = player;
				board._B2._winner = player;
				board._C1._winner = player;
				board.gameWon();
				return assert.startsWith(board._winner, player, `board._winner starts with ${player}`);
			});
		}
	});
});