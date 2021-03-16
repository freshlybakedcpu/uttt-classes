'use strict';

const fs = require('fs');
const Board = require('./classes/board.js');
const imgcomp = require('./src/imagecomp-canvas_async');

const board = new Board();

const tictactoe_X = './images/tictactoe_X.png';
const tictactoe_O = './images/tictactoe_O.png';
const tint = false;

const jsonData = fs.readFileSync('output/save.json');
Object.assign(board, JSON.parse(jsonData));
console.log(board);

imgcomp.run(board, tictactoe_X, tictactoe_O, tint);