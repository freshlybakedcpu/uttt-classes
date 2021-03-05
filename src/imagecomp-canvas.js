const nodeCanvas = require('canvas');
const fs = require('fs');
const { spacePositions, squares, innerSquares } = require('../json/uttt.json');

const canvas = nodeCanvas.createCanvas(600, 600);
const ctx = canvas.getContext('2d');

function repeat() {
	nodeCanvas.loadImage('images/board.png').then(board => {
		ctx.drawImage(board, 0, 0);
		nodeCanvas.loadImage('images/tictactoe_O.png').then(piece_O => {
			const randOne = Math.floor(Math.random() * squares.length);
			const randTwo = Math.floor(Math.random() * innerSquares.length);

			ctx.drawImage(piece_O, spacePositions[squares[randOne] + innerSquares[randTwo]][0], spacePositions[squares[randOne] + innerSquares[randTwo]][1], 60, 60);
			const buffer = canvas.toBuffer('image/png');
			fs.writeFileSync('./images/image.png', buffer);
		});
	});
}

setInterval(repeat, 2000);