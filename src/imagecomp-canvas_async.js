const nodeCanvas = require('canvas');
const fs = require('fs');
const { spacePositions, squares, innerSquares } = require('../json/uttt.json');

module.exports.run = (board, tictactoe_X, tictactoe_O, tint) => {
	const startTime = Date.now();

	const canvas = nodeCanvas.createCanvas(600, 600);
	const ctx = canvas.getContext('2d');

	/*
	const numTimes = 5;

	for(let i = 0; i < numTimes; i++) {
		boardstate.push(`${player}${squares[Math.floor(Math.random() * squares.length)]}${innerSquares[Math.floor(Math.random() * innerSquares.length)]}`);
		(player === 'X') ? player = 'O' : player = 'X';
	}
	*/

	const localPieces = [];
	const globalPieces = [];
	const localLines = [];
	let globalLine;

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
				globalLine = `L${value.substring(1)}`;
			}
			}
		}
	}

	console.log(localPieces);
	console.log(globalPieces);
	console.log(localLines);
	console.log(globalLine);

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

		const asyncPieceFunction = async item => {
			return drawLocalPiece(item);
		};

		const localPieceDrawing = async () => {
			return Promise.all(localPieces.map(e => asyncPieceFunction(e)));
		};

		localPieceDrawing().then(() => {
			const asyncLineFunction = async item => {
				return drawLocalLine(item);
			};

			const localLineDrawing = async () => {
				return Promise.all(localLines.map(e => asyncLineFunction(e)));
			};

			localLineDrawing().then(() => {
				fs.writeFileSync('./output/image.png', canvas.toBuffer('image/png'));
				console.log(`Done: ${Date.now() - startTime} ms`);
			});
		});
	});

	async function drawLocalPiece(piece) {
		return new Promise(resolve => {
			nodeCanvas.loadImage(`images/tictactoe_${piece.charAt(0)}.png`).then(pieceImage => {
				ctx.drawImage(pieceImage, spacePositions[piece.substring(1)][0], spacePositions[piece.substring(1)][1], 60, 60);
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
				// ctx.rotate((Math.PI / 180) * 45);
				ctx.fillStyle = '#000000';
				ctx.fillRect(25 + spacePositions[line.substring(1, 5)][0], spacePositions[line.substring(1, 5)][1], 10, 190);
				ctx.restore();
				resolve();
				break;
			}
			case 'diagonalbacksmall' : {
				console.log(line);
				ctx.save();
				ctx.rotate((Math.PI / 180) * 45);
				ctx.fillStyle = '#000000';
				ctx.fillRect(spacePositions[line.substring(1, 5)][0] + 235, spacePositions[line.substring(1, 5)][1] - 270, 255, 10);
				ctx.restore();
				resolve();
				break;
			}
			case 'diagonalforwardsmall' : {
				ctx.save();
				ctx.rotate((Math.PI / 180) * -45);
				ctx.fillStyle = '#000000';
				ctx.fillRect(spacePositions[line.substring(1, 5)][0] - (255 / 2) - (10 / 2), (255 / 2) + (10 / 2) + spacePositions[line.substring(1, 3) + line.substring(5, 7)][1], 255, 10);
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
				// ctx.rotate((Math.PI / 180) * 45);
				ctx.fillStyle = '#000000';
				ctx.fillRect(spacePositions[line.substring(1, 3)][0], 26 + spacePositions[line.substring(1, 3)][1], 190, 10);
				ctx.restore();
				resolve();
				break;
			}
			case 'verticallarge' : {
				ctx.save();
				// ctx.rotate((Math.PI / 180) * 45);
				ctx.fillStyle = '#000000';
				ctx.fillRect(spacePositions[line.substring(1, 3)][0], 26 + spacePositions[line.substring(1, 3)][1], 190, 10);
				ctx.restore();
				resolve();
				break;
			}
			case 'diagonalbacklarge' : {
				ctx.save();
				// ctx.rotate((Math.PI / 180) * 45);
				ctx.fillStyle = '#000000';
				ctx.fillRect(spacePositions[line.substring(1, 3)][0], 26 + spacePositions[line.substring(1, 3)][1], 190, 10);
				ctx.restore();
				resolve();
				break;
			}
			case 'diagonalforwardlarge' : {
				ctx.save();
				// ctx.rotate((Math.PI / 180) * 45);
				ctx.fillStyle = '#000000';
				ctx.fillRect(spacePositions[line.substring(1, 3)][0], 26 + spacePositions[line.substring(1, 3)][1], 190, 10);
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
};