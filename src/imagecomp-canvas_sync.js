const nodeCanvas = require('canvas');
const fs = require('fs');
const { spacePositions, squares, innerSquares } = require('../json/uttt.json');

module.exports.run = (board, tictactoe_X, tictactoe_O, tint) => {
	const canvas = nodeCanvas.createCanvas(600, 600);
	const ctx = canvas.getContext('2d');

	const boardstate = [];

	/*
	const numTimes = 5;

	for(let i = 0; i < numTimes; i++) {
		boardstate.push(`${player}${squares[Math.floor(Math.random() * squares.length)]}${innerSquares[Math.floor(Math.random() * innerSquares.length)]}`);
		(player === 'X') ? player = 'O' : player = 'X';
	}
	*/

	const player1 = [];
	const player2 = [];
	const lines = [];

	for (const [key, value] of Object.entries(board)) {
		if (squares.includes(key.substring(1))) {
			for (const [innerKey, innerValue] of Object.entries(value)) {
				if (innerSquares.includes(innerKey.substring(1)) && innerValue === 'X') {
					// boardstate.push(`X${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
					player1.push(`${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
				}
				else if (innerSquares.includes(innerKey.substring(1)) && innerValue === 'O') {
					// boardstate.push(`O${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
					player2.push(`${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
				}
				else if (innerKey.substring(1) === 'winner' && (innerValue === 'X' || innerValue === 'O')) {
					// boardstate.push(`${innerValue}${key.substring(1)}`);
					// boardstate.push(`L${key.substring(1)}${value._winningCombination}`);
					lines.push(`L${key.substring(1)}${value._winningCombination}`);
				}
			}
		}
		else if (key.substring(1) === 'winner' && value !== null) {
			switch (value.startsWith('X') || value.startsWith('O')) {
			case true : {
				// boardstate.push(`L${value.substring(1)}`);
				lines.push(`L${value.substring(1)}`);
			}
			}
		}
	}
	console.log(player1);
	console.log(player2);
	console.log(lines);

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
		const startTime = Date.now();

		ctx.drawImage(boardImg, 0, 0);

		player1.forEach(e => {
			drawPiece(e, 'X');
		});
		player2.forEach(e => {
			drawPiece(e, 'O');
		});

		fs.writeFileSync('./output/image.png', canvas.toBuffer('image/png'));
		console.log(`Done: ${Date.now() - startTime} ms`);
	});

	function drawPiece(piece, player) {
		nodeCanvas.loadImage(`images/tictactoe_${player}.png`).then(pieceImage => {
			ctx.drawImage(pieceImage, spacePositions[piece][0], spacePositions[piece][1], 60, 60);
		}).catch(err => {
			console.log(err);
		});
	}

	function drawLine(line) {
		console.log('heya');
	}
};