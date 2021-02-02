'use strict';

const assert = require('chai').assert;

const fs = require('fs');

describe('Images', function() {
	it('Board exists', function() {
		return assert.isTrue(fs.existsSync('./images/board.png'), 'File \'board.png\' exists.');
	});
	it('Line exists', function() {
		return assert.isTrue(fs.existsSync('./images/line.png'), 'File \'line.png\' exists.');
	});
	it('\'X\' piece exists', function() {
		return assert.isTrue(fs.existsSync('./images/tictactoe_X.png'), 'File \'tictactoe_X.png\' exists.');
	});
	it('\'O\' piece exists', function() {
		return assert.isTrue(fs.existsSync('./images/tictactoe_O.png'), 'File \'tictactoe_O.png\' exists.');
	});
});