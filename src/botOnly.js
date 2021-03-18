'use strict';

const fs = require('fs');
const Board = require('../classes/board.js');
const Player = require('../classes/player.js');
const uttt = require('../json/uttt.json');
const imgcomp = require('../src/imagecomp-canvas_async');

const board = new Board();

const tictactoe_X = './images/tictactoe_X.png';
const tictactoe_O = './images/tictactoe_O.png';
const tint = false;

let turn = 'player1';
let turnNumber = 1;
let validMoves = uttt.fullboard;

// Game setup
console.log('Welcome to Ultimate Tic-Tac-Toe!\n');

const player1 = new Player('bot');
const player2 = new Player('bot');

(function loop() {
	if (!board._winner) {
		const move = (() => {
			const botMove = (turn === 'player1') ? player1.randomMove(validMoves) : player2.randomMove(validMoves);
			console.log(botMove);
			return botMove;
		})();
		fs.appendFileSync('./output/gameHistory.txt', `${turnNumber}\t${turn}: ${move}\n`);
		board.inputMove(move, turn);
		board.checkWinner(move);
		board.gameWon();
		turn = (turn === 'player1') ? 'player2' : 'player1';
		validMoves = board.validMoves(move);
		console.log(validMoves);
		turnNumber++;
		loop();
	}
	else {
		try {
			fs.writeFileSync('output/save.json', JSON.stringify(board, null, '\t'), function(err) {
				if(err) {
					console.log(err);
				}
			});
		}
		catch (err) {
			console.error(err);
		}
		switch (board._winner !== 'tie') {
		case true : {
			console.log(`\n${(turn === 'player1') ? 'Player 2' : 'Player 1'} has won.`);
			fs.appendFileSync('./output/gameHistory.txt', `\n${(turn === 'player1') ? 'Player 2' : 'Player 1'} has won.`);
			break;
		}
		case false : {
			console.log('\nTie.');
			fs.appendFileSync('./output/gameHistory.txt', '\nTie.');
			break;
		}
		}
		imgcomp.run(board, tictactoe_X, tictactoe_O, tint);
	}
}());