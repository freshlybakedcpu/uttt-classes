const input = require('readline-sync');
// const Board = require('./classes/board');
const imgcomp = require('./imagecomposition');
const uttt = require('../uttt.json');

let boardstate = [];
let validMoves = uttt.fullboard;

let move;

let turn = 'player1';

(function loop() {
	if (true) {
		validMoves = validMoves.filter(i => !boardstate.includes(`X${i}`) && !boardstate.includes(`O${i}`));
		console.log(validMoves);
		move = userPrompt(turn);
		nextQuadrant(move);
		boardstate.push(`${(turn === 'player1') ? 'X' : 'O'}${move}`);
		turn = (turn === 'player1') ? 'player2' : 'player1';
		imgcomp.run(boardstate).then(value => {
			boardstate = value;
			boardstate = boardstate.filter(values => !values.startsWith('Y'));
			loop();
		});
	}
}());

function userPrompt(player) {
	const choice = input.question(`${player}, your move: `);
	return (validMoves.includes(choice)) ? choice : invalidMovePrompt(player);
}

function invalidMovePrompt(player) {
	console.log(`Invalid move. Playable moves: ${validMoves}.`);
	const choice = input.question(`${player}, your move: `);
	return (validMoves.includes(choice)) ? choice : invalidMovePrompt(player);
}

function nextQuadrant(value) {
	// Top
	if (uttt.topleft.filter(word => word.length !== 2).includes(value)) {
		if (boardstate.includes('XA1') || boardstate.includes('OA1')) {
			validMoves = uttt.fullboard;
			boardstate.push('Yfull');
		}
		else {
			validMoves = ['A1X1', 'A1X2', 'A1X3', 'A1Y1', 'A1Y2', 'A1Y3', 'A1Z1', 'A1Z2', 'A1Z3'];
			boardstate.push('YA1');
		}
	}
	else if (uttt.topmid.filter(word => word.length !== 2).includes(value)) {
		if (boardstate.includes('XB1') || boardstate.includes('OB1')) {
			validMoves = uttt.fullboard;
			boardstate.push('Yfull');
		}
		else {
			validMoves = ['B1X1', 'B1X2', 'B1X3', 'B1Y1', 'B1Y2', 'B1Y3', 'B1Z1', 'B1Z2', 'B1Z3'];
			boardstate.push('YB1');
		}
	}
	else if (uttt.topright.filter(word => word.length !== 2).includes(value)) {
		if (boardstate.includes('XC1') || boardstate.includes('OC1')) {
			validMoves = uttt.fullboard;
			boardstate.push('Yfull');
		}
		else {
			validMoves = ['C1X1', 'C1X2', 'C1X3', 'C1Y1', 'C1Y2', 'C1Y3', 'C1Z1', 'C1Z2', 'C1Z3'];
			boardstate.push('YC1');
		}
	}
	// Center
	else if (uttt.centerleft.filter(word => word.length !== 2).includes(value)) {
		if (boardstate.includes('XA2') || boardstate.includes('OA2')) {
			validMoves = uttt.fullboard;
			boardstate.push('Yfull');
		}
		else {
			validMoves = ['A2X1', 'A2X2', 'A2X3', 'A2Y1', 'A2Y2', 'A2Y3', 'A2Z1', 'A2Z2', 'A2Z3'];
			boardstate.push('YA2');
		}
	}
	else if (uttt.centermid.filter(word => word.length !== 2).includes(value)) {
		if (boardstate.includes('XB2') || boardstate.includes('OB2')) {
			validMoves = uttt.fullboard;
			boardstate.push('Yfull');
		}
		else {
			validMoves = ['B2X1', 'B2X2', 'B2X3', 'B2Y1', 'B2Y2', 'B2Y3', 'B2Z1', 'B2Z2', 'B2Z3'];
			boardstate.push('YB2');
		}
	}
	else if (uttt.centerright.filter(word => word.length !== 2).includes(value)) {
		if (boardstate.includes('XC2') || boardstate.includes('OC2')) {
			validMoves = uttt.fullboard;
			boardstate.push('Yfull');
		}
		else {
			validMoves = ['C2X1', 'C2X2', 'C2X3', 'C2Y1', 'C2Y2', 'C2Y3', 'C2Z1', 'C2Z2', 'C2Z3'];
			boardstate.push('YC2');
		}
	}
	// Bottom
	else if (uttt.bottomleft.filter(word => word.length !== 2).includes(value)) {
		if (boardstate.includes('XA3') || boardstate.includes('OA3')) {
			validMoves = uttt.fullboard;
			boardstate.push('Yfull');
		}
		else {
			validMoves = ['A3X1', 'A3X2', 'A3X3', 'A3Y1', 'A3Y2', 'A3Y3', 'A3Z1', 'A3Z2', 'A3Z3'];
			boardstate.push('YA3');
		}
	}
	else if (uttt.bottommid.filter(word => word.length !== 2).includes(value)) {
		if (boardstate.includes('XB3') || boardstate.includes('OB3')) {
			validMoves = uttt.fullboard;
			boardstate.push('Yfull');
		}
		else {
			validMoves = ['B3X1', 'B3X2', 'B3X3', 'B3Y1', 'B3Y2', 'B3Y3', 'B3Z1', 'B3Z2', 'B3Z3'];
			boardstate.push('YB3');
		}
	}
	else if (uttt.bottomright.filter(word => word.length !== 2).includes(value)) {
		if (boardstate.includes('XC3') || boardstate.includes('OC3')) {
			validMoves = uttt.fullboard;
			boardstate.push('Yfull');
		}
		else {
			validMoves = ['C3X1', 'C3X2', 'C3X3', 'C3Y1', 'C3Y2', 'C3Y3', 'C3Z1', 'C3Z2', 'C3Z3'];
			boardstate.push('YC3');
		}
	}
}