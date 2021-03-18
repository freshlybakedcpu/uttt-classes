class player {
	constructor(type) {
		// Type of player (human or bot)
		this._type = type;
	}
	// Selects a random move from array of valid moves (for bot players)
	randomMove(validMoves) {
		return validMoves[Math.floor(Math.random() * validMoves.length)];
	}
}

module.exports = player;