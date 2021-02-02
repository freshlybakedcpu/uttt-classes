class square {
	constructor() {
		this._X1 = null;
		this._X2 = null;
		this._X3 = null;

		this._Y1 = null;
		this._Y2 = null;
		this._Y3 = null;

		this._Z1 = null;
		this._Z2 = null;
		this._Z3 = null;

		this._winner = null;
		this._winningCombination = null;
	}
	checkWins() {
		// Player 1
		if(this._X1 === 'X' && this._X2 === 'X' && this._X3 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X1X3' + 'VVS'; // Vertical small
		}
		else if(this._Y1 === 'X' && this._Y2 === 'X' && this._Y3 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'Y1Y3' + 'VVS'; // Vertical small
		}
		else if(this._Z1 === 'X' && this._Z2 === 'X' && this._Z3 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'Z1Z3' + 'VVS'; // Vertical small
		}
		else if(this._X1 === 'X' && this._Y1 === 'X' && this._Z1 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X1Z1' + 'HHS'; // Horizontal small
		}
		else if(this._X2 === 'X' && this._Y2 === 'X' && this._Z2 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X2Z2' + 'HHS'; // Horizontal small
		}
		else if(this._X3 === 'X' && this._Y3 === 'X' && this._Z3 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X3Z3' + 'HHS'; // Horizontal small
		}
		else if(this._X1 === 'X' && this._Y2 === 'X' && this._Z3 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X1Z3' + 'DBS'; // Diagonal back small
		}
		else if(this._X3 === 'X' && this._Y2 === 'X' && this._Z1 === 'X') {
			this._winner = 'X';
			this._winningCombination = 'X3Z1' + 'DFS'; // Diagonal forward small
		}
		// Player 2
		else if(this._X1 === 'O' && this._X2 === 'O' && this._X3 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X1X3' + 'VVS'; // Vertical small
		}
		else if(this._Y1 === 'O' && this._Y2 === 'O' && this._Y3 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'Y1Y3' + 'VVS'; // Vertical small
		}
		else if(this._Z1 === 'O' && this._Z2 === 'O' && this._Z3 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'Z1Z3' + 'VVS'; // Vertical small
		}
		else if(this._X1 === 'O' && this._Y1 === 'O' && this._Z1 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X1Z1' + 'HHS'; // Horizontal small
		}
		else if(this._X2 === 'O' && this._Y2 === 'O' && this._Z2 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X2Z2' + 'HHS'; // Horizontal small
		}
		else if(this._X3 === 'O' && this._Y3 === 'O' && this._Z3 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X3Z3' + 'HHS'; // Horizontal small
		}
		else if(this._X1 === 'O' && this._Y2 === 'O' && this._Z3 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X1Z3' + 'DBS'; // Diagonal back small
		}
		else if(this._X3 === 'O' && this._Y2 === 'O' && this._Z1 === 'O') {
			this._winner = 'O';
			this._winningCombination = 'X3Z1' + 'DFS'; // Diagonal forward small
		}
		else if(this._X1 !== null && this._X2 !== null && this._X3 !== null && this._Y1 !== null && this._Y2 !== null && this._Y3 !== null && this._Z1 !== null && this._Z2 !== null && this._Z3 !== null) {
			this._winner = 'tie';
		}
	}
}

module.exports = square;