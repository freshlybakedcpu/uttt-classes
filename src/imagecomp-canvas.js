const nodeCanvas = require('canvas');
const fs = require('fs');
const { resolve } = require('path');
const { spacePositions, squares, innerSquares } = require('../json/uttt.json');

const canvas = nodeCanvas.createCanvas(600, 600);
const ctx = canvas.getContext('2d');

const boardstate = [];
let player = 'X';

const numTimes = Math.floor(Math.random() * (10 - 1) + 1); // The maximum is exclusive and the minimum is inclusive
for(let i = 0; i < numTimes; i++) {
	boardstate.push(`${player}${squares[Math.floor(Math.random() * squares.length)]}${innerSquares[Math.floor(Math.random() * innerSquares.length)]}`);
	(player === 'X') ? player = 'O' : player = 'X';
}

// https://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed
nodeCanvas.loadImage('images/board.png').then(board => {
	ctx.drawImage(board, 0, 0);
	/*
	boardstate.forEach(e => {
		drawPiece(e);
	});
	*/
	/*
	const requests = boardstate.map((e) => {
		return new Promise((resolve) => {
			drawPiece(e, resolve);
			// asyncFunction(item, resolve);
		});
	});

	Promise.all(requests).then(() => {
		console.log('done');
		fs.writeFileSync('./images/image.png', canvas.toBuffer('image/png'));
	}).catch(err => {
		console.log(err);
	});
	*/
	const asyncFunction = async item => {
		return drawPiece(item);
	};
	const getData = async () => {
		return Promise.all(boardstate.map(e => asyncFunction(e)));
	};

	getData().then(() => {
		console.log('done');
		fs.writeFileSync('./images/image.png', canvas.toBuffer('image/png'));
	});
	// console.log('done');
	// fs.writeFileSync('./images/image.png', canvas.toBuffer('image/png'));
});

function drawPiece(piece) {
	return new Promise(resolve => {
		nodeCanvas.loadImage(`images/tictactoe_${piece.charAt(0)}.png`).then(pieceImage => {
			ctx.drawImage(pieceImage, spacePositions[piece.substring(1)][0], spacePositions[piece.substring(1)][1], 60, 60);
			resolve();
		// fs.writeFileSync('./images/image.png', canvas.toBuffer('image/png'));
		}).catch(err => {
			console.log(err);
		});
	});
}