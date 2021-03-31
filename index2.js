'use strict';

const fs = require('fs');
// const path = require('path');
const rl = require('readline-sync');
const Board = require('./classes/board.js');
const Player = require('./classes/player.js');
const uttt = require('./json/uttt.json');
const imgcomp = require('./src/imagecomp-canvas_async');

// Create an object instance of Board class
const board = new Board();

// Variable to hold turn; player 1 moves first
let turn = 'player1';
// Number of turns in the game
let turnNumber = 1;
// Array of valid moves; initialized with all moves valid
let validMoves = uttt.fullboard;

// Resets file used to hold game history
fs.truncateSync('./output/gameHistory.txt', 0);

// Game setup
console.log('\nWelcome to Ultimate Tic-Tac-Toe!\n');

// Sets players equal to input from user
const player1 = new Player(playerType('1'));
const player2 = new Player(playerType('2'));

// Asks users to input type of player (for players 1 and 2)
function playerType(num) {
	switch (rl.question(`Is \x1b[48;5;${(num === '1') ? '1' : '33'}mplayer ${num}\x1b[0m a bot or human? `).toLowerCase()) {
	case 'bot' : return 'bot';
	case 'b' : return 'bot';
	case 'human' : return 'human';
	case 'h' : return 'human';
	default : {
		console.log('Invalid input. Choices: \'bot\', \'human\'.\n');
		return playerType(num);
	}
	}
}

// Set to true if custom images will be used and vice versa.
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
		const givenPath = rl.question(`\tPlease provide the path of the image that will represent ${(piece === 'X') ? 'player 1' : 'player 2'}: `);
		switch (givenPath) {
		// Entering "default" will prompt the program to use the default pieces
		case 'default' : {
			return (piece === 'X') ? './images/tictactoe_X.png' : './images/tictactoe_O.png';
		}
		default : {
			// Checks if the path for the image is valid
			switch (fs.existsSync(givenPath)) {
			case true : {
				return givenPath;
			}
			default : {
				console.log('\tInvalid path.\n');
				return imageAssignment(piece);
			}
			}
		}
		}
	}
	// If the user opted not to use custom pieces, the program uses the default images
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

const importPath = importPrompt();

function importPrompt() {
	switch (rl.question('\nWould you like to import existing save data? (y/n) ').toLowerCase()) {
	case 'y' : return importPathPrompt();
	case 'n' : return false;
	default : {
		console.log('Invalid input. Choices: \'y\', \'n\'.\n');
		importPrompt();
	}
	}
}

function importPathPrompt() {
	const givenPath = rl.question('\nWhat is the path? ');
	try {
		if (fs.existsSync(path.resolve(givenPath)) && /^.+\.(?:(?:[jJ][sS][oO][nN]))$/.test(givenPath)) {
			return path.resolve(givenPath);
		}
		else {
			return importPathPrompt();
		}
	}
	catch(err) {
		console.error(err);
	}
}

// https://stackoverflow.com/questions/30339675/how-to-map-json-data-to-a-class
if (importPath) {
	const jsonData = fs.readFileSync(importPath);
	Object.assign(board, JSON.parse(jsonData));
	// board.importJSON(JSON.parse(jsonData));
	console.log(board);
}
*/
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
	if(validMoves.includes(choice)) {
		return choice;
	}
	else if(choice === 'export') {
		// console.log(JSON.stringify(board));
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
		return userPrompt(player);
	}
	else {
		return invalidMovePrompt(player);
	}
}

function invalidMovePrompt(player) {
	console.log(`\x1b[1A\x1b[2KInvalid move. Playable moves: \x1b[38;5;46m${validMoves}\x1b[0m.`);
	const choice = rl.question(`\x1b[48;5;${(player === 'player1') ? '1' : '33'}m${player}\x1b[0m, your move: `);
	return (validMoves.includes(choice)) ? choice : invalidMovePrompt(player);
}