const sharp = require('sharp');
// const sizeOf = require('image-size');
const uttt = require('./uttt.json');
const { winningcombinations, spacePositions } = require('./uttt.json');

module.exports.run = (boardstate) => {
	console.log(boardstate);

	const imagePromises = [];
	let winner;

	return new Promise((result) => {
		let player1 = boardstate.filter(move => move.startsWith('X'));
		player1.forEach(((value, i) => player1[i] = value.substring(1)));

		let player2 = boardstate.filter(move => move.startsWith('O'));
		player2.forEach(((value, i) => player2[i] = value.substring(1)));

		winningcombinations.forEach(row => {
			if(player1.includes(row[1]) && player1.includes(row[2]) && player1.includes(row[3])) {
				if(row[0] !== 'game') {
					boardstate.push(`L${row[1]}${row[3]}`);
					boardstate.push(`X${row[0]}`);
				}
			}
			if(player2.includes(row[1]) && player2.includes(row[2]) && player2.includes(row[3])) {
				if(row[0] !== 'game') {
					boardstate.push(`L${row[1]}${row[3]}`);
					boardstate.push(`O${row[0]}`);
				}
			}
		});

		// Reassign the player arrays to include the squares won.
		player1 = boardstate.filter(move => move.startsWith('X'));
		player1.forEach(((value, i) => player1[i] = value.substring(1)));
		console.log('\nPlayer 1: ');
		console.log(player1);

		player2 = boardstate.filter(move => move.startsWith('O'));
		player2.forEach(((value, i) => player2[i] = value.substring(1)));
		console.log('\nPlayer 2: ');
		console.log(player2);

		winningcombinations.forEach(row => {
			if(player1.includes(row[1]) && player1.includes(row[2]) && player1.includes(row[3])) {
				if(row[0] === 'game') {
					console.log(`player1 wins; L${row[1]}${row[3]}`);
					winner = 'player1';
					boardstate.push(`L${row[1]}${row[3]}`);
				}
			}
			if(player2.includes(row[1]) && player2.includes(row[2]) && player2.includes(row[3])) {
				if(row[0] === 'game') {
					console.log(`player2 wins; L${row[1]}${row[3]}`);
					winner = 'player2';
					boardstate.push(`L${row[1]}${row[3]}`);
				}
			}
		});

		// Removes yellows from boardstate
		const yellow = boardstate.filter(move => move.startsWith('Y'));

		let sortingArray = [];

		sortingArray = sortingArray.concat(boardstate.filter(move => !move.startsWith('L') && move.length === 5));
		sortingArray = sortingArray.concat(boardstate.filter(move => move.startsWith('L') && move.length === 9));
		sortingArray = sortingArray.concat(boardstate.filter(move => move.length === 3));
		sortingArray = sortingArray.concat(boardstate.filter(move => move.startsWith('L') && move.length === 5));

		boardstate = sortingArray.filter(move => !move.startsWith('Y'));

		// let dimensions = sizeOf('images/line.png');
		// console.log(`\nline.png: ${dimensions.width} x ${dimensions.height}`);

		// dimensions = sizeOf('images/tictactoe_X.png');
		// console.log(`tictactoe_X.png: ${dimensions.width} x ${dimensions.height}`);

		// dimensions = sizeOf('images/tictactoe_O.png');
		// console.log(`tictactoe_O.png: ${dimensions.width} x ${dimensions.height}`);

		console.log('\nLoading images...');
		const images = [];
		boardstate.forEach((value, index) => {
			process.stdout.write(`\r\x1b[K\t(${index + 1} of ${boardstate.length})`);
			if(value.startsWith('X')) {
				images.push('./images/tictactoe_X.png');
			// images.push('https://imgur.com/A1SehSf.png');
			}
			else if(value.startsWith('O')) {
				images.push('./images/tictactoe_O.png');
			// images.push('https://imgur.com/Ycqs1Jc.png');
			}
			else if (value.startsWith('L')) {
				images.push('./images/line.png');
			// images.push('https://i.imgur.com/NzSWDkX.png');
			}
		});


		const initPromise = new Promise((resolve) => {
			console.log('\n\nResizing and orienting images...');
			images.forEach((img, index, array) => {
				imagePromises.push(
					get(img)
						.then((imgBuffer) => {
							if(boardstate[index].startsWith('L')) {
								const value = lineDirection(boardstate[index]);
								if(boardstate[index].substring(1).length === 8) {
									console.log(`\tLine ${boardstate[index].substring(1)}: ${boardstate[index].substring(1).slice(0, 4)}, ${boardstate[index].substring(1).slice(4, 8)}; ${value}`);
								}
								else if(boardstate[index].length === 4) {
									console.log(`\tLine ${boardstate[index].substring(1)}: ${boardstate[index].substring(1).slice(0, 2)}, ${boardstate[index].substring(1).slice(2, 4)}; ${value}`);
								}
								if(value === 'horizontalsmall') {
									return sharp(imgBuffer)
										.resize({
											width: 190,
											height: 10,
											fit: sharp.fit.fill,
										})
									// .withMetadata()
										.png()
										.toBuffer();
								}
								else if(value === 'verticalsmall') {
									return sharp(imgBuffer)
										.resize({
											width: 10,
											height: 190,
											fit: sharp.fit.fill,
										})
									// .withMetadata()
										.png()
										.toBuffer();
								}
								else if(value === 'diagonalbacksmall') {
									return sharp(imgBuffer)
										.rotate(45, {
											background: { r: 255, g: 255, b: 255, alpha: 0 },
										})
										.resize({
											width: 255,
											height: 10,
											fit: sharp.fit.fill,
										})
									// .withMetadata()
										.png()
										.toBuffer();
								}
								else if(value === 'diagonalforwardsmall') {
									return sharp(imgBuffer)
										.rotate(-45, {
											background: { r: 255, g: 255, b: 255, alpha: 0 },
										})
										.resize({
											width: 255,
											height: 10,
											fit: sharp.fit.fill,
										})
									// .withMetadata()
										.png()
										.toBuffer();
								}
								else if(value === 'horizontallarge') {
									return sharp(imgBuffer)
										.resize({
											width: 190 * 3,
											height: 10 * 3,
											fit: sharp.fit.fill,
										})
									// .withMetadata()
										.png()
										.toBuffer();
								}
								else if(value === 'verticallarge') {
									return sharp(imgBuffer)
										.resize({
											width: 10 * 3,
											height: 190 * 3,
											fit: sharp.fit.fill,
										})
									// .withMetadata()
										.png()
										.toBuffer();
								}
								else if(value === 'diagonalbacklarge') {
									return sharp(imgBuffer)
										.rotate(45, {
											background: { r: 255, g: 255, b: 255, alpha: 0 },
										})
										.resize({
											width: 255 * 3,
											height: 10 * 3,
											fit: sharp.fit.fill,
										})
									// .withMetadata()
										.png()
										.toBuffer();
								}
								else if(value === 'diagonalforwardlarge') {
									return sharp(imgBuffer)
										.rotate(-45, {
											background: { r: 255, g: 255, b: 255, alpha: 0 },
										})
										.resize({
											width: 255 * 3,
											height: 10 * 3,
											fit: sharp.fit.fill,
										})
									// .withMetadata()
										.png()
										.toBuffer();
								}
							}
							else if(boardstate[index].length === 5) {
								console.log(`\tPiece: ${boardstate[index].substring(1)}`);
								return sharp(imgBuffer)
									.resize(60)
									.modulate({
										brightness: 0.9, // increase lightness by a factor of 2
									})
								// .withMetadata()
									.png()
									.toBuffer();
							}
							else if(boardstate[index].length === 3) {
								console.log(`\tPiece: ${boardstate[index].substring(1)}`);
								return sharp(imgBuffer)
									.resize(180)
									.modulate({
										brightness: 1.1, // increase lightness by a factor of 2
									})
								// .withMetadata()
									.png()
									.toBuffer();
							}
							else {
								console.log('NONE');
							}
						})
						.catch((err) => console.log(err)),
				);
				if (index === array.length - 1) resolve();
			});
		});

		// Create something to overlay the images on
		const backgroundPromise = sharp('./images/board.png')
			.sharpen()
			.png()
			.toBuffer();

		/*
		const backgroundPromise = sharp((!yellow.length) ? './images/board_transparent.png' : './images/yellow.jpg')
			.resize({ width: (!yellow.length) ? 600 : 200, height: (!yellow.length) ? 600 : 200 })
			.sharpen()
			.composite([{ input: './images/board_transparent.png', left: 0, top: 0 }])
			.png()
			.toBuffer();
		*/

		initPromise.then(() => {
			console.log('\nOverlaying images...');
			console.log(boardstate);
			Promise.all(imagePromises)
				.then((imgBuffers) => {
					let i = -1;

					return imgBuffers.reduce((current, overlay) => {
						return current.then((curr) => {
							i++;
							if (boardstate[i].startsWith('X') || boardstate[i].startsWith('O')) {
								console.log(`\tOverlaying image ${i + 1}: ${(boardstate[i].startsWith('X')) ? 'P1' : 'P2'} at ${boardstate[i].substring(1)}; left: ${spacePositions[boardstate[i].substring(1)][0]}, top: ${spacePositions[boardstate[i].substring(1)][1]}`);
								return sharp(curr)
									.composite([{ input: overlay, left: spacePositions[boardstate[i].substring(1)][0], top: spacePositions[boardstate[i].substring(1)][1] }])
								// .withMetadata()
									.toBuffer();
							}
							else if (boardstate[i].startsWith('L')) {
								const value = lineDirection(boardstate[i]);
								if(value === 'horizontalsmall') {
									console.log(`\tOverlaying image ${i + 1}: Line at ${boardstate[i].substring(1)}; left: ${spacePositions[boardstate[i].substring(1).slice(0, -4)][0]}, top: ${26 + spacePositions[boardstate[i].substring(1).slice(0, -4)][1]}`);
									return sharp(curr)
										.composite([{ input: overlay, left: spacePositions[boardstate[i].substring(1).slice(0, -4)][0], top: 26 + spacePositions[boardstate[i].substring(1).slice(0, -4)][1] }])
									// .withMetadata()
										.toBuffer();
								}
								else if(value === 'verticalsmall') {
									console.log(`\tOverlaying image ${i + 1}: Line at ${boardstate[i].substring(1)}; left: ${26 + spacePositions[boardstate[i].substring(1).slice(0, -4)][0]}, top: ${spacePositions[boardstate[i].substring(1).slice(0, -4)][1]}`);
									return sharp(curr)
										.composite([{ input: overlay, left: 26 + spacePositions[boardstate[i].substring(1).slice(0, -4)][0], top: spacePositions[boardstate[i].substring(1).slice(0, -4)][1] }])
									// .withMetadata()
										.toBuffer();
								}
								else if(value === 'diagonalbacksmall') {
									console.log(`\tOverlaying image ${i + 1}: Line at ${boardstate[i].substring(1)}; left: ${0 + spacePositions[boardstate[i].substring(1).slice(0, 4)][0]}, top: ${0 + spacePositions[boardstate[i].substring(1).slice(0, 4)][1]}`);
									return sharp(curr)
										.composite([{ input: overlay, left: 0 + spacePositions[boardstate[i].substring(1).slice(0, 4)][0], top: 0 + spacePositions[boardstate[i].substring(1).slice(0, 4)][1] }])
									// .withMetadata()
										.toBuffer();
								}
								else if(value === 'diagonalforwardsmall') {
									console.log(`\tOverlaying image ${i + 1}: Line at ${boardstate[i].substring(1)}; left: ${1 + spacePositions[boardstate[i].substring(1).slice(0, 4)][0]}, top: ${0 + spacePositions[boardstate[i].substring(1).slice(4, 8)][1]}`);
									return sharp(curr)
										.composite([{ input: overlay, left: 1 + spacePositions[boardstate[i].substring(1).slice(0, 4)][0], top: 3 + spacePositions[boardstate[i].substring(1).slice(4, 8)][1] }])
									// .withMetadata()
										.toBuffer();
								}
								else if(value === 'horizontallarge') {
									console.log(`\tOverlaying image ${i + 1}: Line at ${boardstate[i].substring(1)}; left: ${spacePositions[boardstate[i].substring(1).slice(0, -2)][0]}, top: ${26 * 3 + spacePositions[boardstate[i].substring(1).slice(0, -2)][1]}`);
									return sharp(curr)
										.composite([{ input: overlay, left: spacePositions[boardstate[i].substring(1).slice(0, -2)][0], top: 26 * 3 + spacePositions[boardstate[i].substring(1).slice(0, -2)][1] }])
									// .withMetadata()
										.toBuffer();
								}
								else if(value === 'verticallarge') {
									console.log(`\tOverlaying image ${i + 1}: Line at ${boardstate[i].substring(1)}; left: ${26 * 3 + spacePositions[boardstate[i].substring(1).slice(0, -2)][0]}, top: ${spacePositions[boardstate[i].substring(1).slice(0, -2)][1]}`);
									return sharp(curr)
										.composite([{ input: overlay, left: 26 * 3 + spacePositions[boardstate[i].substring(1).slice(0, -2)][0], top: spacePositions[boardstate[i].substring(1).slice(0, -2)][1] }])
									// .withMetadata()
										.toBuffer();
								}
								else if(value === 'diagonalbacklarge') {
									console.log(`\tOverlaying image ${i + 1}: Line at ${boardstate[i].substring(1)}; left: ${0 + spacePositions[boardstate[i].substring(1).slice(0, 2)][0]}, top: ${0 + spacePositions[boardstate[i].substring(1).slice(0, 2)][1]}`);
									return sharp(curr)
										.composite([{ input: overlay, left: 0 + spacePositions[boardstate[i].substring(1).slice(0, 2)][0], top: 0 + spacePositions[boardstate[i].substring(1).slice(0, 2)][1] }])
									// .withMetadata()
										.toBuffer();
								}
								else if(value === 'diagonalforwardlarge') {
									console.log(`\tOverlaying image ${i + 1}: Line at ${boardstate[i].substring(1)}; left: ${1 * 3 + spacePositions[boardstate[i].substring(1).slice(0, 2)][0]}, top: ${0 + spacePositions[boardstate[i].substring(1).slice(2, 4)][1]}`);
									return sharp(curr)
										.composite([{ input: overlay, left: 1 * 3 + spacePositions[boardstate[i].substring(1).slice(0, 2)][0], top: 3 + spacePositions[boardstate[i].substring(1).slice(2, 4)][1] }])
									// .withMetadata()
										.toBuffer();
								}
							}
						});
					}, backgroundPromise);
				})
				.then((noFormatImage) => {
					console.log('\nConverting to PNG...');
					return sharp(noFormatImage)
						.png()
						.toBuffer();
				})
				.then((finishedImageBuffer) => {
					console.log('\nWriting to storage...');
					return sharp(finishedImageBuffer)
						.toFile('./output/output.png');
				})
				.then(() => {
					result(boardstate);
				})
				.catch((err) => console.log(err));
		});
	});
};

function get(path) {
	return new Promise((resolve) => {
		resolve(path);
	});
}

function lineDirection(line) {
	line = line.substring(1);
	if (line.length === 8) {
		const begin = line.slice(0, 4);
		const end = line.slice(4, 8);
		if((uttt.topleft.includes(begin) && uttt.bottomleft.includes(end)) || (uttt.topmid.includes(begin) && uttt.bottommid.includes(end)) || (uttt.topright.includes(begin) && uttt.bottomright.includes(end))) {
			return('verticalsmall');
		}
		else if((uttt.topleft.includes(begin) && uttt.topright.includes(end)) || (uttt.centerleft.includes(begin) && uttt.centerright.includes(end)) || (uttt.bottomleft.includes(begin) && uttt.bottomright.includes(end))) {
			return('horizontalsmall');
		}
		else if(uttt.bottomleft.includes(begin) && uttt.topright.includes(end)) {
			return('diagonalforwardsmall');
		}
		else if(uttt.topleft.includes(begin) && uttt.bottomright.includes(end)) {
			return('diagonalbacksmall');
		}
		else {
			return('nonesmall');
		}
	}
	else if (line.length === 4) {
		const begin = line.slice(0, 2);
		const end = line.slice(2, 4);
		if((uttt.topleft.includes(begin) && uttt.bottomleft.includes(end)) || (uttt.topmid.includes(begin) && uttt.bottommid.includes(end)) || (uttt.topright.includes(begin) && uttt.bottomright.includes(end))) {
			return('verticallarge');
		}
		else if((uttt.topleft.includes(begin) && uttt.topright.includes(end)) || (uttt.centerleft.includes(begin) && uttt.centerright.includes(end)) || (uttt.bottomleft.includes(begin) && uttt.bottomright.includes(end))) {
			return('horizontallarge');
		}
		else if(uttt.bottomleft.includes(begin) && uttt.topright.includes(end)) {
			return('diagonalforwardlarge');
		}
		else if(uttt.topleft.includes(begin) && uttt.bottomright.includes(end)) {
			return('diagonalbacklarge');
		}
		else {
			return('nonelarge');
		}
	}
	else {
		return('nonelength');
	}
}