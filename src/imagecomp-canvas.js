const nodeCanvas = require('canvas');
const fs = require('fs');
const { spacePositions, squares, innerSquares } = require('../json/uttt.json');

const canvas = nodeCanvas.createCanvas(600, 600);
const ctx = canvas.getContext('2d');

const boardstate = [];
let player = 'X';
let buffer = canvas.toBuffer('image/png');

const numTimes = Math.floor(Math.random() * (10 - 1) + 1); // The maximum is exclusive and the minimum is inclusive
for(let i = 0; i < numTimes; i++) {
	boardstate.push(`${player}${squares[Math.floor(Math.random() * squares.length)]}${innerSquares[Math.floor(Math.random() * innerSquares.length)]}`);
	(player === 'X') ? player = 'O' : player = 'X';
}

// https://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed
nodeCanvas.loadImage('images/board.png').then(board => {
	ctx.drawImage(board, 0, 0);
	buffer = canvas.toBuffer('image/png');

	const requests = boardstate.map((e) => {
		return new Promise((resolve) => {
			if(e.charAt(0) === 'X') {
				drawX(e.substring(1), resolve);
			}
			else {
				drawO(e.substring(1), resolve);
			}
			// asyncFunction(item, resolve);
		});
	});

	Promise.all(requests).then(() => {
		console.log('done');
		fs.writeFileSync('./images/image.png', buffer);
	});
	/*
	boardstate.forEach(e => {
		if(e.charAt(0) === 'X') {
			drawX(e.substring(1));
		}
		else {
			drawO(e.substring(1));
		}
	});
	fs.writeFileSync('./images/image.png', buffer);
	*/
});

async function drawO(piece) {
	nodeCanvas.loadImage('images/tictactoe_O.png').then(piece_O => {
		ctx.drawImage(piece_O, spacePositions[piece][0], spacePositions[piece][1], 60, 60);
		buffer = canvas.toBuffer('image/png');
	});
}

async function drawX(piece) {
	nodeCanvas.loadImage('images/tictactoe_X.png').then(piece_X => {
		ctx.drawImage(piece_X, spacePositions[piece][0], spacePositions[piece][1], 60, 60);
		buffer = canvas.toBuffer('image/png');
	});
}