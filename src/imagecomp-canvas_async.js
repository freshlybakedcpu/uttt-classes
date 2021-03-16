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
					});
				});
			});
		});
	});

	async function drawPiece(piece, size) {
		return new Promise(resolve => {
			nodeCanvas.loadImage(`images/tictactoe_${piece.charAt(0)}.png`).then(pieceImage => {
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
};