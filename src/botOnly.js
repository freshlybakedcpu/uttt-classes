const fs = require('fs');
const rl = require('readline-sync');
// const sharp = require('sharp');
const Board = require('../classes/board.js');
const Player = require('../classes/player.js');
const uttt = require('../json/uttt.json');
// const imgcomp = require('./imagecomp-sharp');

const board = new Board();

let turn = 'player1';
let turnNumber = 1;
let validMoves = uttt.fullboard;

/*
fs.truncateSync('./output/gameHistory.txt', 0);
sharp('./images/board.png')
	.sharpen()
	.png()
	.toFile('./output/board.png');
*/

// Game setup
console.log('Welcome to Ultimate Tic-Tac-Toe!\n');

const player1 = new Player('bot');
const player2 = new Player('bot');

// const tictactoe_X = './images/tictactoe_X.png';
// const tictactoe_O = './images/tictactoe_O.png';

// const tint = false;

(function loop() {
	if (board._winner === null) {
		const move = (() => {
			switch ((turn === 'player1') ? player1._type : player2._type) {
			case 'bot' : {
				const botMove = (turn === 'player1') ? player1.randomMove(validMoves) : player2.randomMove(validMoves);
				console.log(botMove);
				return botMove;
			}
			case 'human' : {
				return userPrompt(turn);
			}
			default : {
				return userPrompt(turn);
			}
			}
		})();
		fs.appendFileSync('./output/gameHistory.txt', `${turnNumber}\t${turn}: ${move}\n`);
		board.inputMove(move, turn);
		board.checkWinner(move);
		board.gameWon();
		turn = (turn === 'player1') ? 'player2' : 'player1';
		validMoves = board.validMoves(move);
		console.log(validMoves);
		// imgcomp.run(board, tictactoe_X, tictactoe_O, tint).then(() => {
		turnNumber++;
		loop();
		// });
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
	}
}());

function userPrompt(player) {
	const choice = rl.question(`${player}, your move: `);
	return (validMoves.includes(choice)) ? choice : invalidMovePrompt(player);
}

function invalidMovePrompt(player) {
	console.log(`Invalid move. Playable moves: ${validMoves}.`);
	const choice = rl.question(`${player}, your move: `);
	return (validMoves.includes(choice)) ? choice : invalidMovePrompt(player);
}