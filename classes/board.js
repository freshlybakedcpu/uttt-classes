const fs = require('fs');

const Square = require('./squares.js');
const { squares, innerSquares } = require('../json/uttt.json');

class Board {
	constructor() {
		this._A1 = new Square();
		this._A2 = new Square();
		this._A3 = new Square();

		this._B1 = new Square();
		this._B2 = new Square();
		this._B3 = new Square();

		this._C1 = new Square();
		this._C2 = new Square();
		this._C3 = new Square();

		this._winner = null;
		// Currently unused variable. Program to allow last move to be undone.
		this._lastMove = null;
	}

	importJSON(jsonData) {
		// Object.assign(this, jsonData);
		for (const [key, value] of Object.entries(this)) {
			console.log(`${key}, ${value}`);
			if(typeof jsonData[key] === 'object' && jsonData[key] !== null) {
				console.log('\tis object');
				Object.assign(this[key], jsonData[key]);
			}
			else {
				this[key] = jsonData[key];
			}
		}
		console.log(this);
	}
	inputMove(position, player) {
		const square = '_' + position.substring(0, 2);
		const place = '_' + position.substring(2, 4);
		this[square][place] = (player === 'player1') ? 'X' : 'O';
		this._lastMove = `${(player === 'player1') ? 'X' : 'O'}${position}`;
	}
	checkWinner(position) {
		const square = '_' + position.substring(0, 2);
		this[square].checkWins();
		switch (this[square]._winner) {
		case 'X' :
			fs.appendFileSync('./output/gameHistory.txt', `\t${square.substring(1)}; Winner: Player 1\n`);
			console.log(`${square.substring(1)}; Winner: Player 1\n`);
			break;
		case 'O' :
			fs.appendFileSync('./output/gameHistory.txt', `\t${square.substring(1)}; Winner: Player 2\n`);
			console.log(`${square.substring(1)}; Winner: Player 2\n`);
			break;
		default :
			break;
		}
	}
	gameWon() {
		// Player 1
		if(this._A1._winner === 'X' && this._A2._winner === 'X' && this._A3._winner === 'X') {
			this._winner = 'XA1A3' + 'VVL'; // Vertical large
		}
		else if(this._B1._winner === 'X' && this._B2._winner === 'X' && this._B3._winner === 'X') {
			this._winner = 'XB1B3' + 'VVL'; // Vertical large
		}
		else if(this._C1._winner === 'X' && this._C2._winner === 'X' && this._C3._winner === 'X') {
			this._winner = 'XC1C3' + 'VVL'; // Vertical large
		}
		else if(this._A1._winner === 'X' && this._B1._winner === 'X' && this._C1._winner === 'X') {
			this._winner = 'XA1C1' + 'HHL'; // Horizontal large
		}
		else if(this._A2._winner === 'X' && this._B2._winner === 'X' && this._C2._winner === 'X') {
			this._winner = 'XA2C2' + 'HHL'; // Horizontal large
		}
		else if(this._A3._winner === 'X' && this._B3._winner === 'X' && this._C3._winner === 'X') {
			this._winner = 'XA3C3' + 'HHL'; // Horizontal large
		}
		else if(this._A1._winner === 'X' && this._B2._winner === 'X' && this._C3._winner === 'X') {
			this._winner = 'XA1C3' + 'DBL'; // Diagonal back large
		}
		else if(this._A3._winner === 'X' && this._B2._winner === 'X' && this._C1._winner === 'X') {
			this._winner = 'XA3C1' + 'DFL'; // Diagonal forward large
		}
		// Player 2
		else if(this._A1._winner === 'O' && this._A2._winner === 'O' && this._A3._winner === 'O') {
			this._winner = 'OA1A3' + 'VVL'; // Vertical large
		}
		else if(this._B1._winner === 'O' && this._B2._winner === 'O' && this._B3._winner === 'O') {
			this._winner = 'OB1B3' + 'VVL'; // Vertical large
		}
		else if(this._C1._winner === 'O' && this._C2._winner === 'O' && this._C3._winner === 'O') {
			this._winner = 'OC1C3' + 'VVL'; // Vertical large
		}
		else if(this._A1._winner === 'O' && this._B1._winner === 'O' && this._C1._winner === 'O') {
			this._winner = 'OA1C1' + 'HHL'; // Horizontal large
		}
		else if(this._A2._winner === 'O' && this._B2._winner === 'O' && this._C2._winner === 'O') {
			this._winner = 'OA2C2' + 'HHL'; // Horizontal large
		}
		else if(this._A3._winner === 'O' && this._B3._winner === 'O' && this._C3._winner === 'O') {
			this._winner = 'OA3C3' + 'HHL'; // Horizontal large
		}
		else if(this._A1._winner === 'O' && this._B2._winner === 'O' && this._C3._winner === 'O') {
			this._winner = 'OA1C3' + 'DBL'; // Diagonal back large
		}
		else if(this._A3._winner === 'O' && this._B2._winner === 'O' && this._C1._winner === 'O') {
			this._winner = 'OA3C3' + 'DFL'; // Diagonal forward large
		}
		else if(this._A1._winner !== null && this._A2._winner !== null && this._A3._winner !== null && this._B1._winner !== null && this._B2._winner !== null && this._B3._winner !== null && this._C1._winner !== null && this._C2._winner !== null && this._C3._winner !== null) {
			this._winner = 'tie';
		}
	}
	validMoves(position) {
		const orientation = (() => {
			switch (position.substring(2, 4)) {
			case 'X1' : return '_A1';
			case 'X2' : return '_A2';
			case 'X3' : return '_A3';
			case 'Y1' : return '_B1';
			case 'Y2' : return '_B2';
			case 'Y3' : return '_B3';
			case 'Z1' : return '_C1';
			case 'Z2' : return '_C2';
			case 'Z3' : return '_C3';
			default : return null;
			}
		})();
		if (this[orientation]._winner !== null) {
			const validMoves = [];
			for (const [key, value] of Object.entries(this)) {
				if (squares.includes(key.substring(1)) && value._winner === null) {
					for (const [innerKey, innerValue] of Object.entries(value)) {
						if (innerValue === null && innerSquares.includes(innerKey.substring(1))) {
							validMoves.push(`${key.substring(1, 3)}${innerKey.substring(1, 3)}`);
						}
					}
				}
			}
			return validMoves;
		}
		else {
			const validMoves = [];
			for (const [key, value] of Object.entries(this[orientation])) {
				if (value === null && innerSquares.includes(key.substring(1, 3))) {
					validMoves.push(`${orientation.substring(1)}${key.substring(1, 3)}`);
				}
			}
			return validMoves;
		}
	}
}

module.exports = Board;