const fs = require('fs');
const rl = require('readline-sync');
const sharp = require('sharp');
const Board = require('./classes/board.js');
const Player = require('./classes/player.js');
const uttt = require('./json/uttt.json');
const imgcomp = require('./src/imagecomposition');

const board = new Board();

let turn = 'player1';
let turnNumber = 1;
let validMoves = uttt.fullboard;

fs.truncateSync('./output/gameHistory.txt', 0);
sharp('./images/board.png')
	.sharpen()
	.png()
	.toFile('./output/board.png');

// Game setup
console.log('\nWelcome to Ultimate Tic-Tac-Toe!\n');

const player1 = new Player(playerType('1'));
const player2 = new Player(playerType('2'));

function playerType(num) {
	switch (rl.question(`Is \x1b[48;5;${(num === '1') ? '1' : '33'}mplayer ${num}\x1b[0m a bot or human? `).toLowerCase()) {
	case 'bot' : return 'bot';
	case 'human' : return 'human';
	default : {
		console.log('Invalid input. Choices: \'bot\', \'human\'.\n');
		return playerType(num);
	}
	}
}

const imageBool = imagePrompt();

function imagePrompt() {
	switch (rl.question('\nWould you like to use custom images for the pieces? (y/n) ').toLowerCase()) {
	case 'y' : return true;
	case 'n' : return false;
	default : {
		console.log('Invalid input. Choices: \'y\', \'n\'.\n');
		imagePrompt();
	}
	}
}

const tictactoe_X = imageAssignment('X');
const tictactoe_O = imageAssignment('O');

function imageAssignment(piece) {
	switch (imageBool) {
	case true : {
		const path = rl.question(`\tPlease provide the path of the image that will represent ${(piece === 'X') ? 'player 1' : 'player 2'}: `);
		switch (path) {
		case 'default' : {
			return (piece === 'X') ? './images/tictactoe_X.png' : './images/tictactoe_O.png';
		}
		default : {
			switch (fs.existsSync(path)) {
			case true : {
				return path;
			}
			default : {
				console.log('\tInvalid path.\n');
				return imageAssignment(piece);
			}
			}
		}
		}
	}
	default : {
		return (piece === 'X') ? './images/tictactoe_X.png' : './images/tictactoe_O.png';
	}
	}
}

const tint = tintPrompt();

function tintPrompt() {
	switch (rl.question('\nWould you like to apply a colored tint to the images? (y/n) ').toLowerCase()) {
	case 'y' : return true;
	case 'n' : return false;
	default : {
		console.log('Invalid input. Choices: \'y\', \'n\'.\n');
		tintPrompt();
	}
	}
}

(function loop() {
	if (board._winner === null) {
		const move = (() => {
			switch ((turn === 'player1') ? player1._type : player2._type) {
			case 'bot' : {
				const botMove = (turn === 'player1') ? player1.randomMove(validMoves) : player2.randomMove(validMoves);
				console.log(`\n\x1b[48;5;${(turn === 'player1') ? '1' : '33'}m${(turn === 'player1') ? 'player 1' : 'player 2'}\x1b[0m's move: ${botMove}`);
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
		board._lastMove = move;
		fs.appendFileSync('./output/gameHistory.txt', `${turnNumber}\t${turn}: ${move}\n`);
		board.inputMove(move, turn);
		board.checkWinner(move);
		board.gameWon();
		turn = (turn === 'player1') ? 'player2' : 'player1';
		validMoves = board.validMoves(move);
		console.log(validMoves);
		imgcomp.run(board, tictactoe_X, tictactoe_O, tint).then(() => {
			turnNumber++;
			loop();
		});
	}
	else {
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
	const choice = rl.question(`\n\x1b[48;5;${(player === 'player1') ? '1' : '33'}m${player}\x1b[0m, your move: `);
	return (validMoves.includes(choice)) ? choice : invalidMovePrompt(player);
}

function invalidMovePrompt(player) {
	console.log(`\x1b[1A\x1b[2KInvalid move. Playable moves: \x1b[38;5;46m${validMoves}\x1b[0m.`);
	const choice = rl.question(`\x1b[48;5;${(player === 'player1') ? '1' : '33'}m${player}\x1b[0m, your move: `);
	return (validMoves.includes(choice)) ? choice : invalidMovePrompt(player);
}