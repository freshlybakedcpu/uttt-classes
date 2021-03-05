const sharp = require('sharp');
const { spacePositions, squares, innerSquares } = require('../json/uttt.json');

module.exports.run = (board, tictactoe_X, tictactoe_O, tint) => {
	const imagePromises = [];
	let boardstate = [];

	return new Promise((result) => {
		const player1 = [];
		const player2 = [];
		for (const [key, value] of Object.entries(board)) {
			if (squares.includes(key.substring(1))) {
				for (const [innerKey, innerValue] of Object.entries(value)) {
					if (innerSquares.includes(innerKey.substring(1)) && innerValue === 'X') {
						boardstate.push(`X${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
						player1.push(`${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
					}
					else if (innerSquares.includes(innerKey.substring(1)) && innerValue === 'O') {
						boardstate.push(`O${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
						player2.push(`${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
					}
					else if (innerKey.substring(1) === 'winner' && (innerValue === 'X' || innerValue === 'O')) {
						boardstate.push(`${innerValue}${key.substring(1)}`);
						boardstate.push(`L${key.substring(1)}${value._winningCombination}`);
					}
				}
			}
			else if (key.substring(1) === 'winner' && value !== null) {
				switch (value.startsWith('X') || value.startsWith('O')) {
				case true : {
					boardstate.push(`L${value.substring(1)}`);
				}
				}
			}
		}

		let sortingArray = [];

		sortingArray = sortingArray.concat(boardstate.filter(move => !move.startsWith('L') && move.length === 5));
		sortingArray = sortingArray.concat(boardstate.filter(move => move.startsWith('L') && move.length === 7 + 3));
		sortingArray = sortingArray.concat(boardstate.filter(move => move.length === 3));
		sortingArray = sortingArray.concat(boardstate.filter(move => move.startsWith('L') && move.length === 5 + 3));

		// Old code that sorted out values that started with 'Y'. Maybe unnecessary?
		boardstate = sortingArray.filter(move => !move.startsWith('Y'));

		console.log(boardstate);

		// console.log(`Boardstate: ${boardstate}`);
		// console.log(`Player 1: ${player1}`);
		// console.log(`Player 2: ${player2}`);

		const images = [];
		boardstate.forEach(value => {
			if(value.startsWith('X')) {
				images.push(tictactoe_X);
			}
			else if(value.startsWith('O')) {
				images.push(tictactoe_O);
			}
			else if (value.startsWith('L')) {
				images.push('./images/line.png');
			}
		});

		const initPromise = new Promise((resolve) => {
			images.forEach((img, index, array) => {
				imagePromises.push(
					get(img)
						.then((imgBuffer) => {
							if(boardstate[index].startsWith('L')) {
								switch (lineDirection(boardstate[index].slice(boardstate[index].length - 3))) {
								case 'horizontalsmall' : {
									return sharp(imgBuffer)
										.resize({
											width: 190,
											height: 10,
											fit: sharp.fit.fill,
										})
										.png()
										.toBuffer();
								}
								case 'verticalsmall' : {
									return sharp(imgBuffer)
										.resize({
											width: 10,
											height: 190,
											fit: sharp.fit.fill,
										})
										.png()
										.toBuffer();
								}
								case 'diagonalbacksmall' : {
									return sharp(imgBuffer)
										.rotate(45, {
											background: { r: 255, g: 255, b: 255, alpha: 0 },
										})
										.resize({
											width: 255,
											height: 10,
											fit: sharp.fit.fill,
										})
										.png()
										.toBuffer();
								}
								case 'diagonalforwardsmall' : {
									return sharp(imgBuffer)
										.rotate(-45, {
											background: { r: 255, g: 255, b: 255, alpha: 0 },
										})
										.resize({
											width: 255,
											height: 10,
											fit: sharp.fit.fill,
										})
										.png()
										.toBuffer();
								}
								case 'horizontallarge' : {
									return sharp(imgBuffer)
										.resize({
											width: 190 * 3,
											height: 10 * 3,
											fit: sharp.fit.fill,
										})
										.png()
										.toBuffer();
								}
								case 'verticallarge' : {
									return sharp(imgBuffer)
										.resize({
											width: 10 * 3,
											height: 190 * 3,
											fit: sharp.fit.fill,
										})
										.png()
										.toBuffer();
								}
								case 'diagonalbacklarge' : {
									return sharp(imgBuffer)
										.rotate(45, {
											background: { r: 255, g: 255, b: 255, alpha: 0 },
										})
										.resize({
											width: 255 * 3,
											height: 10 * 3,
											fit: sharp.fit.fill,
										})
										.png()
										.toBuffer();
								}
								case 'diagonalforwardlarge' : {
									return sharp(imgBuffer)
										.rotate(-45, {
											background: { r: 255, g: 255, b: 255, alpha: 0 },
										})
										.resize({
											width: 255 * 3,
											height: 10 * 3,
											fit: sharp.fit.fill,
										})
										.png()
										.toBuffer();
								}
								default : {
									// Print error description to console
									console.log('Error. Please write description.');
									break;
								}
								}
							}
							else if(boardstate[index].length === 5) {
								switch (boardstate[index].charAt(0)) {
								case 'X' : {
									switch (tint) {
									case true : {
										return sharp(imgBuffer)
											.resize({
												width: 60,
												height: 60,
												fit: sharp.fit.cover,
												position: sharp.strategy.entropy,
											})
											.tint({ r: 255, g: 0, b: 0 })
											.modulate({
												brightness: 0.9,
											})
											.png()
											.toBuffer();
									}
									default : {
										return sharp(imgBuffer)
											.resize({
												width: 60,
												height: 60,
												fit: sharp.fit.cover,
												position: sharp.strategy.entropy,
											})
											.modulate({
												brightness: 0.9,
											})
											.png()
											.toBuffer();
									}
									}

								}
								case 'O' : {
									switch (tint) {
									case true : {
										return sharp(imgBuffer)
											.resize({
												width: 60,
												height: 60,
												fit: sharp.fit.cover,
												position: sharp.strategy.entropy,
											})
											.tint({ r: 0, g: 0, b: 255 })
											.modulate({
												brightness: 0.9,
											})
											.png()
											.toBuffer();
									}
									default : {
										return sharp(imgBuffer)
											.resize({
												width: 60,
												height: 60,
												fit: sharp.fit.cover,
												position: sharp.strategy.entropy,
											})
											.modulate({
												brightness: 0.9,
											})
											.png()
											.toBuffer();
									}
									}

								}
								default : {
									// Print error message to console.
									console.log('Error: Piece type detection failed.');
									break;
								}
								}
							}
							else if(boardstate[index].length === 3) {
								switch (boardstate[index].charAt(0)) {
								case 'X' : {
									switch (tint) {
									case true : {
										return sharp(imgBuffer)
											.resize({
												width: 180,
												height: 180,
												fit: sharp.fit.cover,
												position: sharp.strategy.entropy,
											})
											.tint({ r: 255, g: 0, b: 0 })
											.modulate({
												brightness: 1.1,
											})
											.png()
											.toBuffer();
									}
									default : {
										return sharp(imgBuffer)
											.resize({
												width: 180,
												height: 180,
												fit: sharp.fit.cover,
												position: sharp.strategy.entropy,
											})
											.modulate({
												brightness: 1.1,
											})
											.png()
											.toBuffer();
									}
									}
								}
								case 'O' : {
									switch (tint) {
									case true : {
										return sharp(imgBuffer)
											.resize({
												width: 180,
												height: 180,
												fit: sharp.fit.cover,
												position: sharp.strategy.entropy,
											})
											.tint({ r: 0, g: 0, b: 255 })
											.modulate({
												brightness: 1.1,
											})
											.png()
											.toBuffer();
									}
									default : {
										return sharp(imgBuffer)
											.resize({
												width: 180,
												height: 180,
												fit: sharp.fit.cover,
												position: sharp.strategy.entropy,
											})
											.modulate({
												brightness: 1.1,
											})
											.png()
											.toBuffer();
									}
									}
								}
								default : {
									// Print error message to console.
									console.log('Error: Piece type detection failed.');
									break;
								}
								}

							}
							else {
								console.log('Error: Could not detect piece type.');
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

		initPromise.then(() => {
			Promise.all(imagePromises)
				.then((imgBuffers) => {
					let i = -1;

					return imgBuffers.reduce((current, overlay) => {
						return current.then((curr) => {
							i++;
							if (boardstate[i].startsWith('X') || boardstate[i].startsWith('O')) {
								return sharp(curr)
									.composite([{ input: overlay, left: spacePositions[boardstate[i].substring(1)][0], top: spacePositions[boardstate[i].substring(1)][1] }])
									.toBuffer();
							}
							else if (boardstate[i].startsWith('L')) {
								const direction = lineDirection(boardstate[i].slice(boardstate[i].length - 3));
								if(direction === 'horizontalsmall') {
									const firstValue = boardstate[i].substring(1, 5);
									// const secondValue = boardstate[i].substring(1, 3) + boardstate[i].substring(5, 7);
									return sharp(curr)
										.composite([{ input: overlay, left: spacePositions[firstValue][0], top: 26 + spacePositions[firstValue][1] }])
										.toBuffer();
								}
								else if(direction === 'verticalsmall') {
									const firstValue = boardstate[i].substring(1, 5);
									// const secondValue = boardstate[i].substring(1, 3) + boardstate[i].substring(5, 7);
									return sharp(curr)
										.composite([{ input: overlay, left: 25 + spacePositions[firstValue][0], top: spacePositions[firstValue][1] }])
										.toBuffer();
								}
								else if(direction === 'diagonalbacksmall') {
									const firstValue = boardstate[i].substring(1, 5);
									// const secondValue = boardstate[i].substring(1, 3) + boardstate[i].substring(5, 7);
									return sharp(curr)
										.composite([{ input: overlay, left: 0 + spacePositions[firstValue][0], top: 0 + spacePositions[firstValue][1] }])
										.toBuffer();
								}
								else if(direction === 'diagonalforwardsmall') {
									const firstValue = boardstate[i].substring(1, 5);
									const secondValue = boardstate[i].substring(1, 3) + boardstate[i].substring(5, 7);
									return sharp(curr)
										.composite([{ input: overlay, left: 1 + spacePositions[firstValue][0], top: 3 + spacePositions[secondValue][1] }])
										.toBuffer();
								}
								else if(direction === 'horizontallarge') {
									const firstValue = boardstate[i].substring(1, 3);
									const secondValue = boardstate[i].substring(3, 5);
									return sharp(curr)
										.composite([{ input: overlay, left: spacePositions[firstValue][0], top: 26 * 3 + spacePositions[secondValue][1] }])
										.toBuffer();
								}
								else if(direction === 'verticallarge') {
									const firstValue = boardstate[i].substring(1, 3);
									// const secondValue = boardstate[i].substring(3, 5);
									return sharp(curr)
										.composite([{ input: overlay, left: 25 * 3 + spacePositions[firstValue][0], top: spacePositions[firstValue][1] }])
										.toBuffer();
								}
								else if(direction === 'diagonalbacklarge') {
									const firstValue = boardstate[i].substring(1, 3);
									// const secondValue = boardstate[i].substring(3, 5);
									return sharp(curr)
										.composite([{ input: overlay, left: 0 + spacePositions[firstValue][0], top: spacePositions[firstValue][1] }])
										.toBuffer();
								}
								else if(direction === 'diagonalforwardlarge') {
									const firstValue = boardstate[i].substring(1, 3);
									const secondValue = boardstate[i].substring(3, 5);
									return sharp(curr)
										.composite([{ input: overlay, left: spacePositions[firstValue][0], top: spacePositions[secondValue][1] + 10 }])
										.toBuffer();
								}
							}
						});
					}, backgroundPromise);
				})
				.then((noFormatImage) => {
					return sharp(noFormatImage)
						.png()
						.toBuffer();
				})
				.then((finishedImageBuffer) => {
					return sharp(finishedImageBuffer)
						.toFile('./output/board.png');
				})
				.then(() => {
					result();
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
/*
function lineDirection(line) {
	line = line.substring(1);
	if (line.length === 6) {
		// const square = line.slice(0, 2);
		const begin = line.slice(2, 4);
		const end = line.slice(4, 6);
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
*/