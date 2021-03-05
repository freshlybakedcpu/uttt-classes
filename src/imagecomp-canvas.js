const nodeCanvas = require('canvas');

const canvas = nodeCanvas.createCanvas(600, 600);
const ctx = canvas.getContext('2d');

nodeCanvas.loadImage('images/board.png').then(image => {
    ctx.drawImage(image, 50, 0, 70, 70);
    // console.log('<img src="' + canvas.toDataURL() + '" />');
  })