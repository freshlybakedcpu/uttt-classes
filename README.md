# Ultimate Tic-Tac-Toe

## How To Play
Ultimate Tic-Tac-Toe is a variation of the m,n,k-game Tic-Tac-Toe

## Functionality
there is none.

## Code
> index.js
```
'use strict';

const fs = require('fs');
const path = require('path');
const rl = require('readline-sync');
const Board = require('./classes/board.js');
const Player = require('./classes/player.js');
const uttt = require('./json/uttt.json');
const imgcomp = require('./src/imagecomp-canvas_async');

const board = new Board();

let turn = 'player1';
let turnNumber = 1;
let validMoves = uttt.fullboard;

fs.truncateSync('./output/gameHistory.txt', 0);

// Game setup
console.log('\nWelcome to Ultimate Tic-Tac-Toe!\n');

const player1 = new Player(playerType('1'));
const player2 = new Player(playerType('2'));

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
		case 'default' : {
			return (piece === 'X') ? './images/tictactoe_X.png' : './images/tictactoe_O.png';
		}
		default : {
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
```

> imagecomp-canvas_async.js
```
const nodeCanvas = require('canvas');
const fs = require('fs');
const { spacePositions, squares, innerSquares } = require('../json/uttt.json');

module.exports.run = (board, tictactoe_X, tictactoe_O, tint) => {
	const startTime = Date.now();

	return new Promise((result) => {
		const canvas = nodeCanvas.createCanvas(600, 600);
		const ctx = canvas.getContext('2d');

		const localPieces = [];
		const globalPieces = [];
		const localLines = [];
		const globalLine = [];

		for (const [key, value] of Object.entries(board)) {
			if (squares.includes(key.substring(1))) {
				for (const [innerKey, innerValue] of Object.entries(value)) {
					if (innerSquares.includes(innerKey.substring(1)) && innerValue === 'X') {
						localPieces.push(`X${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
					}
					else if (innerSquares.includes(innerKey.substring(1)) && innerValue === 'O') {
						localPieces.push(`O${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
					}
					else if (innerKey.substring(1) === 'winner' && (innerValue === 'X' || innerValue === 'O')) {
						globalPieces.push(`${innerValue}${key.substring(1)}`);
						localLines.push(`L${key.substring(1)}${value._winningCombination}`);
					}
				}
			}
			else if (key.substring(1) === 'winner' && value !== null) {
				switch (value.startsWith('X') || value.startsWith('O')) {
				case true : {
				// boardstate.push(`L${value.substring(1)}`);
					globalLine.push(`L${value.substring(1)}`);
				}
				}
			}
		}
		/*
		console.log(localPieces);
		console.log(globalPieces);
		console.log(localLines);
		console.log(globalLine);
		*/
		function lineDirection(code) {
			switch (code) {
			case 'VVS' : return 'verticalsmall';
			case 'HHS' : return 'horizontalsmall';
			case 'DBS' : return 'diagonalbacksmall';
			case 'DFS' : return 'diagonalforwardsmall';
			case 'VVL' : return 'verticallarge';
			case 'HHL' : return 'horizontallarge';
			case 'DBL' : return 'diagonalbacklarge';
			case 'DFL' : return 'diagonalforwardlarge';
			default : {
				console.log(`Error: Line direction returned null.\n\tCode: ${code}`);
				return null;
			}
			}
		}

		// https://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed
		nodeCanvas.loadImage('images/board.png').then(boardImg => {
			ctx.drawImage(boardImg, 0, 0);

			const asyncPieceFunction = async (item, size) => {
				return drawPiece(item, size);
			};

			const localPieceDrawing = async () => {
				return Promise.all(localPieces.map(e => asyncPieceFunction(e, 60)));
			};

			localPieceDrawing().then(() => {
				const asyncLocalLineFunction = async item => {
					return drawLocalLine(item);
				};

				const localLineDrawing = async () => {
					return Promise.all(localLines.map(e => asyncLocalLineFunction(e)));
				};

				localLineDrawing().then(() => {
					const globalPieceDrawing = async () => {
						return Promise.all(globalPieces.map(e => asyncPieceFunction(e, 180)));
					};

					globalPieceDrawing().then(() => {
						const asyncGlobalLineFunction = async item => {
							return drawGlobalLine(item);
						};

						const globalLineDrawing = async () => {
							return Promise.all(globalLine.map(e => asyncGlobalLineFunction(e)));
						};

						globalLineDrawing().then(() => {
							fs.writeFileSync('./output/image.png', canvas.toBuffer('image/png'));
							console.log(`Done: ${Date.now() - startTime} ms`);
							result();
						});
					});
				});
			});
		});

		async function drawPiece(piece, size) {
			return new Promise(resolve => {
				nodeCanvas.loadImage((piece.charAt(0) === 'X') ? tictactoe_X : tictactoe_O).then(pieceImage => {
				/*
				if(size === 60) {
					ctx.filter = 'contrast(1.4) sepia(1) drop-shadow(-9px 9px 3px #e81)';
				}
				*/
					ctx.drawImage(pieceImage, spacePositions[piece.substring(1)][0], spacePositions[piece.substring(1)][1], size, size);
					resolve();
				}).catch(err => {
					console.log(err);
				});
			});
		}

		// ctx.fillRect(x, y, width, height);
		async function drawLocalLine(line) {
			return new Promise(resolve => {
				switch (lineDirection(line.slice(line.length - 3))) {
				case 'horizontalsmall' : {
					ctx.save();
					ctx.fillStyle = '#000000';
					ctx.fillRect(spacePositions[line.substring(1, 5)][0], 25 + spacePositions[line.substring(1, 5)][1], 190, 10);
					ctx.restore();
					resolve();
					break;
				}
				case 'verticalsmall' : {
					ctx.save();
					ctx.fillStyle = '#000000';
					ctx.fillRect(25 + spacePositions[line.substring(1, 5)][0], spacePositions[line.substring(1, 5)][1], 10, 190);
					ctx.restore();
					resolve();
					break;
				}
				case 'diagonalbacksmall' : {
					ctx.save();
					ctx.translate(spacePositions[line.substring(1, 5)][0], spacePositions[line.substring(1, 5)][1]);
					ctx.rotate((Math.PI / 180) * 45);
					ctx.translate(-spacePositions[line.substring(1, 5)][0], -spacePositions[line.substring(1, 5)][1]);
					ctx.fillStyle = '#000000';
					ctx.fillRect(spacePositions[line.substring(1, 5)][0] + 8, spacePositions[line.substring(1, 5)][1] - 5, 255, 10);
					ctx.restore();
					resolve();
					break;
				}
				case 'diagonalforwardsmall' : {
					ctx.save();
					ctx.translate(spacePositions[line.substring(1, 5)][0], spacePositions[line.substring(1, 5)][1]);
					ctx.rotate((Math.PI / 180) * -45);
					ctx.translate(-spacePositions[line.substring(1, 5)][0], -spacePositions[line.substring(1, 5)][1]);
					ctx.fillStyle = '#000000';
					ctx.fillRect(spacePositions[line.substring(1, 5)][0] - 35, spacePositions[line.substring(1, 5)][1] + 37, 255, 10);
					ctx.restore();
					resolve();
					break;
				}
				default : {
					// Print error description to console
					console.log('Error. Please write description.');
					break;
				}
				}
			});
		}

		async function drawGlobalLine(line) {
			return new Promise(resolve => {
				switch (lineDirection(line.slice(line.length - 3))) {
				case 'horizontallarge' : {
					ctx.save();
					ctx.fillStyle = '#000000';
					ctx.fillRect(spacePositions[line.substring(1, 3)][0], (25 * 3) + spacePositions[line.substring(3, 5)][1], 190 * 3, 10 * 3);
					ctx.restore();
					resolve();
					break;
				}
				case 'verticallarge' : {
					ctx.save();
					ctx.fillStyle = '#000000';
					ctx.fillRect((25 * 3) + spacePositions[line.substring(1, 3)][0], spacePositions[line.substring(1, 3)][1], 10 * 3, 190 * 3);
					ctx.restore();
					resolve();
					break;
				}
				case 'diagonalbacklarge' : {
					ctx.save();
					ctx.translate(spacePositions[line.substring(1, 3)][0], spacePositions[line.substring(1, 3)][1]);
					ctx.rotate((Math.PI / 180) * 45);
					ctx.translate(-spacePositions[line.substring(1, 3)][0], -spacePositions[line.substring(1, 3)][1]);
					ctx.fillStyle = '#000000';
					ctx.fillRect(spacePositions[line.substring(1, 3)][0] + (8 * 3), spacePositions[line.substring(1, 3)][1] - (5 * 3), 255 * 3, 10 * 3);
					ctx.restore();
					resolve();
					break;
				}
				case 'diagonalforwardlarge' : {
					console.log(line);
					ctx.save();
					ctx.translate(spacePositions[line.substring(1, 3)][0], spacePositions[line.substring(1, 3)][1]);
					ctx.rotate((Math.PI / 180) * -45);
					ctx.translate(-spacePositions[line.substring(1, 3)][0], -spacePositions[line.substring(1, 3)][1]);
					ctx.fillStyle = '#000000';
					ctx.fillRect(spacePositions[line.substring(1, 3)][0] - (35 * 3), spacePositions[line.substring(1, 3)][1] + (37 * 3), 255 * 3, 10 * 3);
					ctx.restore();
					resolve();
					break;
				}
				default : {
					// Print error description to console
					console.log('Error. Please write description.');
					break;
				}
				}
			});
		}
	});
};
```

> player.js
```
class player {
	constructor(type) {
		this._type = type;
	}
	randomMove(validMoves) {
		return validMoves[Math.floor(Math.random() * validMoves.length)];
	}
}

module.exports = player;
```

> board.js
```
const fs = require('fs');

const Square = require('./squares.js');
const { squares, innerSquares } = require('../json/uttt.json');

class Board {
	constructor() {
		this._A1 = new Square();
		this._A2 = new Square();
		this._A3 = new Square();

		this._B1 = new Square();
		this._B2 = new Square();
		this._B3 = new Square();

		this._C1 = new Square();
		this._C2 = new Square();
		this._C3 = new Square();

		this._winner = null;
		// Currently unused variable. Program to allow last move to be undone.
		this._lastMove = null;
	}

	importJSON(jsonData) {
		Object.assign(this, jsonData);
	}
	inputMove(position, player) {
		const square = '_' + position.substring(0, 2);
		const place = '_' + position.substring(2, 4);
		this[square][place] = (player === 'player1') ? 'X' : 'O';
	}
	checkWinner(position) {
		const square = '_' + position.substring(0, 2);
		this[square].checkWins();
		switch (this[square]._winner) {
		case 'X' :
			fs.appendFileSync('./output/gameHistory.txt', `\t${square.substring(1)}; Winner: Player 1\n`);
			console.log(`${square.substring(1)}; Winner: Player 1\n`);
			break;
		case 'O' :
			fs.appendFileSync('./output/gameHistory.txt', `\t${square.substring(1)}; Winner: Player 2\n`);
			console.log(`${square.substring(1)}; Winner: Player 2\n`);
			break;
		default :
			break;
		}
	}
	gameWon() {
		// Note: Incomplete. Need to program what happens once a winner is determined.
		// Player 1
		if(this._A1._winner === 'X' && this._A2._winner === 'X' && this._A3._winner === 'X') {
			this._winner = 'XA1A3' + 'VVL'; // Vertical large
		}
		else if(this._B1._winner === 'X' && this._B2._winner === 'X' && this._B3._winner === 'X') {
			this._winner = 'XB1B3' + 'VVL'; // Vertical large
		}
		else if(this._C1._winner === 'X' && this._C2._winner === 'X' && this._C3._winner === 'X') {
			this._winner = 'XC1C3' + 'VVL'; // Vertical large
		}
		else if(this._A1._winner === 'X' && this._B1._winner === 'X' && this._C1._winner === 'X') {
			this._winner = 'XA1C1' + 'HHL'; // Horizontal large
		}
		else if(this._A2._winner === 'X' && this._B2._winner === 'X' && this._C2._winner === 'X') {
			this._winner = 'XA2C2' + 'HHL'; // Horizontal large
		}
		else if(this._A3._winner === 'X' && this._B3._winner === 'X' && this._C3._winner === 'X') {
			this._winner = 'XA3C3' + 'HHL'; // Horizontal large
		}
		else if(this._A1._winner === 'X' && this._B2._winner === 'X' && this._C3._winner === 'X') {
			this._winner = 'XA1C3' + 'DBL'; // Diagonal back large
		}
		else if(this._A3._winner === 'X' && this._B2._winner === 'X' && this._C1._winner === 'X') {
			this._winner = 'XA3C1' + 'DFL'; // Diagonal forward large
		}
		// Player 2
		else if(this._A1._winner === 'O' && this._A2._winner === 'O' && this._A3._winner === 'O') {
			this._winner = 'OA1A3' + 'VVL'; // Vertical large
		}
		else if(this._B1._winner === 'O' && this._B2._winner === 'O' && this._B3._winner === 'O') {
			this._winner = 'OB1B3' + 'VVL'; // Vertical large
		}
		else if(this._C1._winner === 'O' && this._C2._winner === 'O' && this._C3._winner === 'O') {
			this._winner = 'OC1C3' + 'VVL'; // Vertical large
		}
		else if(this._A1._winner === 'O' && this._B1._winner === 'O' && this._C1._winner === 'O') {
			this._winner = 'OA1C1' + 'HHL'; // Horizontal large
		}
		else if(this._A2._winner === 'O' && this._B2._winner === 'O' && this._C2._winner === 'O') {
			this._winner = 'OA2C2' + 'HHL'; // Horizontal large
		}
		else if(this._A3._winner === 'O' && this._B3._winner === 'O' && this._C3._winner === 'O') {
			this._winner = 'OA3C3' + 'HHL'; // Horizontal large
		}
		else if(this._A1._winner === 'O' && this._B2._winner === 'O' && this._C3._winner === 'O') {
			this._winner = 'OA1C3' + 'DBL'; // Diagonal back large
		}
		else if(this._A3._winner === 'O' && this._B2._winner === 'O' && this._C1._winner === 'O') {
			this._winner = 'OA3C3' + 'DFL'; // Diagonal forward large
		}
		else if(this._A1._winner !== null && this._A2._winner !== null && this._A3._winner !== null && this._B1._winner !== null && this._B2._winner !== null && this._B3._winner !== null && this._C1._winner !== null && this._C2._winner !== null && this._C3._winner !== null) {
			this._winner = 'tie';
		}
	}
	validMoves(position) {
		const orientation = (() => {
			switch (position.substring(2, 4)) {
			case 'X1' : return '_A1';
			case 'X2' : return '_A2';
			case 'X3' : return '_A3';
			case 'Y1' : return '_B1';
			case 'Y2' : return '_B2';
			case 'Y3' : return '_B3';
			case 'Z1' : return '_C1';
			case 'Z2' : return '_C2';
			case 'Z3' : return '_C3';
			default : return null;
			}
		})();
		if (this[orientation]._winner !== null) {
			const validMoves = [];
			for (const [key, value] of Object.entries(this)) {
				if (squares.includes(key.substring(1)) && value._winner === null) {
					for (const [innerKey, innerValue] of Object.entries(value)) {
						if (innerValue === null && innerSquares.includes(innerKey.substring(1))) {
							validMoves.push(`${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
						}
					}
				}
			}
			return validMoves;
		}
		else {
			const validMoves = [];
			for (const [key, value] of Object.entries(this[orientation])) {
				if (value === null && innerSquares.includes(key.substring(1, 3))) {
					validMoves.push(`${orientation.substring(1)}${key.substring(1, 3)}`);
				}
			}
			return validMoves;
		}
		// const place = '_' + position.substring(2, 4);
		// return (this[square][place] === null) ? true : false;
	}
}

module.exports = Board;
```

> squares.js
```
class Square {
	constructor() {
		this._X1 = null;
		this._X2 = null;
		this._X3 = null;

		this._Y1 = null;
		this._Y2 = null;
		this._Y3 = null;

		this._Z1 = null;
		this._Z2 = null;
		this._Z3 = null;

		this._winner = null;
		this._winningCombination = null;
	}
	checkWins() {
		// Player 1
		if(this._X1 === 'X' && this._X2 === 'X' && this._X3 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X1X3' + 'VVS'; // Vertical small
		}
		else if(this._Y1 === 'X' && this._Y2 === 'X' && this._Y3 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'Y1Y3' + 'VVS'; // Vertical small
		}
		else if(this._Z1 === 'X' && this._Z2 === 'X' && this._Z3 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'Z1Z3' + 'VVS'; // Vertical small
		}
		else if(this._X1 === 'X' && this._Y1 === 'X' && this._Z1 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X1Z1' + 'HHS'; // Horizontal small
		}
		else if(this._X2 === 'X' && this._Y2 === 'X' && this._Z2 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X2Z2' + 'HHS'; // Horizontal small
		}
		else if(this._X3 === 'X' && this._Y3 === 'X' && this._Z3 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X3Z3' + 'HHS'; // Horizontal small
		}
		else if(this._X1 === 'X' && this._Y2 === 'X' && this._Z3 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X1Z3' + 'DBS'; // Diagonal back small
		}
		else if(this._X3 === 'X' && this._Y2 === 'X' && this._Z1 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X3Z1' + 'DFS'; // Diagonal forward small
		}
		// Player 2
		else if(this._X1 === 'O' && this._X2 === 'O' && this._X3 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X1X3' + 'VVS'; // Vertical small
		}
		else if(this._Y1 === 'O' && this._Y2 === 'O' && this._Y3 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'Y1Y3' + 'VVS'; // Vertical small
		}
		else if(this._Z1 === 'O' && this._Z2 === 'O' && this._Z3 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'Z1Z3' + 'VVS'; // Vertical small
		}
		else if(this._X1 === 'O' && this._Y1 === 'O' && this._Z1 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X1Z1' + 'HHS'; // Horizontal small
		}
		else if(this._X2 === 'O' && this._Y2 === 'O' && this._Z2 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X2Z2' + 'HHS'; // Horizontal small
		}
		else if(this._X3 === 'O' && this._Y3 === 'O' && this._Z3 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X3Z3' + 'HHS'; // Horizontal small
		}
		else if(this._X1 === 'O' && this._Y2 === 'O' && this._Z3 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X1Z3' + 'DBS'; // Diagonal back small
		}
		else if(this._X3 === 'O' && this._Y2 === 'O' && this._Z1 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X3Z1' + 'DFS'; // Diagonal forward small
		}
		else if(this._X1 !== null && this._X2 !== null && this._X3 !== null && this._Y1 !== null && this._Y2 !== null && this._Y3 !== null && this._Z1 !== null && this._Z2 !== null && this._Z3 !== null) {
			this._winner = 'tie';
		}
	}
}

module.exports = Square;
```

> uttt.json
```
{
    "fullboard": ["A1X1", "A1X2", "A1X3", "A1Y1", "A1Y2", "A1Y3", "A1Z1", "A1Z2", "A1Z3", "B1X1", "B1X2", "B1X3", "B1Y1", "B1Y2", "B1Y3", "B1Z1", "B1Z2", "B1Z3", "C1X1", "C1X2", "C1X3", "C1Y1", "C1Y2", "C1Y3", "C1Z1", "C1Z2", "C1Z3", "A2X1", "A2X2", "A2X3", "A2Y1", "A2Y2", "A2Y3", "A2Z1", "A2Z2", "A2Z3", "B2X1", "B2X2", "B2X3", "B2Y1", "B2Y2", "B2Y3", "B2Z1", "B2Z2", "B2Z3", "C2X1", "C2X2", "C2X3", "C2Y1", "C2Y2", "C2Y3", "C2Z1", "C2Z2", "C2Z3", "A3X1", "A3X2", "A3X3", "A3Y1", "A3Y2", "A3Y3", "A3Z1", "A3Z2", "A3Z3", "B3X1", "B3X2", "B3X3", "B3Y1", "B3Y2", "B3Y3", "B3Z1", "B3Z2", "B3Z3", "C3X1", "C3X2", "C3X3", "C3Y1", "C3Y2", "C3Y3", "C3Z1", "C3Z2", "C3Z3"],
    "squares": ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"],
    "innerSquares": ["X1", "X2", "X3", "Y1", "Y2", "Y3", "Z1", "Z2", "Z3"],
    "spacePositions": {
        "A1": [12, 12],
        "A2": [12, 210],
        "A3": [12, 410],

        "B1": [212, 12],
        "B2": [210, 210],
        "B3": [210, 410],

        "C1": [410, 12],
        "C2": [410, 210],
        "C3": [410, 410],

        "A1X1": [5, 5],
        "A1X2": [5, 71],
        "A1X3": [5, 137],
        "A1Y1": [71, 5],
        "A1Y2": [71, 71],
        "A1Y3": [71, 137],
        "A1Z1": [137, 5],
        "A1Z3": [137, 137],
        "A1Z2": [137, 71],

        "B1X1": [205, 5],
        "B1X2": [205, 71],
        "B1X3": [205, 137],
        "B1Y1": [271, 5],
        "B1Y2": [271, 71],
        "B1Y3": [271, 137],
        "B1Z1": [337, 5],
        "B1Z2": [337, 71],
        "B1Z3": [337, 137],

        "C1X1": [405, 5],
        "C1X2": [405, 71],
        "C1X3": [405, 137],
        "C1Y1": [471, 5],
        "C1Y2": [471, 71],
        "C1Y3": [471, 137],
        "C1Z1": [537, 5],
        "C1Z2": [537, 71],
        "C1Z3": [537, 137],
    
        "A2X1": [5, 205],
        "A2X2": [5, 271],
        "A2X3": [5, 337],
        "A2Y1": [71, 205],
        "A2Y2": [71, 271],
        "A2Y3": [71, 337],
        "A2Z1": [137, 205],
        "A2Z2": [137, 271],
        "A2Z3": [137, 337],
    
        "B2X1": [205, 205],
        "B2X2": [205, 271],
        "B2X3": [205, 337],
        "B2Y1": [271, 205],
        "B2Y2": [271, 271],
        "B2Y3": [271, 337],
        "B2Z1": [337, 205],
        "B2Z2": [337, 271],
        "B2Z3": [337, 337],
    
        "C2X1": [405, 205],
        "C2X2": [405, 271],
        "C2X3": [405, 337],
        "C2Y1": [471, 205],
        "C2Y2": [471, 271],
        "C2Y3": [471, 337],
        "C2Z1": [537, 205],
        "C2Z2": [537, 271],
        "C2Z3": [537, 337],
    
        "A3X1": [5, 405],
        "A3X2": [5, 471],
        "A3X3": [5, 537],
        "A3Y1": [71, 405],
        "A3Y2": [71, 471],
        "A3Y3": [71, 537],
        "A3Z1": [137, 405],
        "A3Z2": [137, 471],
        "A3Z3": [137, 537],
    
        "B3X1": [205, 405],
        "B3X2": [205, 471],
        "B3X3": [205, 537],
        "B3Y1": [271, 405],
        "B3Y2": [271, 471],
        "B3Y3": [271, 537],
        "B3Z1": [337, 405],
        "B3Z2": [337, 471],
        "B3Z3": [337, 537],
    
        "C3X1": [405, 405],
        "C3X2": [405, 471],
        "C3X3": [405, 537],
        "C3Y1": [471, 405],
        "C3Y2": [471, 471],
        "C3Y3": [471, 537],
        "C3Z1": [537, 405],
        "C3Z2": [537, 471],
        "C3Z3": [537, 537]
    }
  }
```