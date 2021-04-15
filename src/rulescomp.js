const nodeCanvas = require('canvas');
const fs = require('fs');

const instructions = 'Each small 3 × 3 tic-tac-toe board is referred to as a local board, and the larger\n3 × 3 board is referred to as the global board.\n\nThe game starts with X playing wherever they want in any of the 81 empty spots.\nThis move "sends" their opponent to its relative location.  For example, if X played\nin the top right square of their local board, then O needs to play next in the local\nboard at the top right of the global board. O can then play in any one of the nine\navailable spots in that local board, each move sending X to a different local board.\n\nIf a move is played so that it is to win a local board by the rules of normal tic-tac-toe,\nthen the entire local board is marked as a victory for the player in the global board.\n\nOnce a local board is won by a player or it is filled completely, no more moves may\nbe played in that board. If a player is sent to such a board, then that player may\nplay in any other board.\n\nGame play ends when either a player wins the global board or there are no legal\nmoves remaining, in which case the game is a draw.';

module.exports.run = () => {
	const startTime = Date.now();

	return new Promise((result) => {
		const canvas = nodeCanvas.createCanvas(600, 600);
		const ctx = canvas.getContext('2d');

		nodeCanvas.loadImage('images/board.png').then(boardImg => {
			ctx.drawImage(boardImg, 0, 0);

			ctx.fillStyle = 'AliceBlue';
			ctx.fillRect(20, 115, canvas.width - 50, canvas.height - 220);

			ctx.fillStyle = 'black';
			ctx.font = '30px bold Arial';
			ctx.textAlign = 'center';
			ctx.fillText('Ultimate Tic-Tac-Toe', canvas.width / 2, (canvas.height / 2) - 150);

			ctx.font = '15px Arial';
			ctx.fillText(instructions, canvas.width / 2, (canvas.height / 2) - 110);
			fs.writeFileSync('./output/image.png', canvas.toBuffer('image/png'));

			console.log(`Done: ${Date.now() - startTime} ms\n`);
			result();
		});
	});
};