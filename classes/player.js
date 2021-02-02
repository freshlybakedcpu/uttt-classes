class player {
	constructor(type) {
		this._type = type;
	}
	randomMove(validMoves) {
		return validMoves[Math.floor(Math.random() * validMoves.length)];
	}
}

module.exports = player;