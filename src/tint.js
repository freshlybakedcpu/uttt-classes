const nodeCanvas = require('canvas');
global.Image = nodeCanvas.Image;

module.exports.run = (inputImage, type) => {
	return new Promise((result) => {
		nodeCanvas.loadImage(inputImage).then(pieceImg => {
			const outputRgbks = generateRGBKs(pieceImg);
			const tintImg = generateTintImage(pieceImg, outputRgbks, (type === 'X') ? 255 : 0, 0, (type === 'X') ? 0 : 255);
			console.log(`heya: ${typeof tintImg}`);
			result(tintImg);
		});

		function generateRGBKs(img) {
			const w = img.width;
			const h = img.height;
			const rgbks = [];

			const cvs = nodeCanvas.createCanvas(w, h);

			const context = cvs.getContext('2d');
			context.drawImage(img, 0, 0);

			const pixels = context.getImageData(0, 0, w, h).data;

			// 4 is used to ask for 3 images: red, green, blue and
			// black in that order.
			for (let rgbI = 0; rgbI < 4; rgbI++) {
				const cvs2 = nodeCanvas.createCanvas(w, h);
				cvs2.width = w;
				cvs2.height = h;

				const context2 = cvs2.getContext('2d');
				context2.drawImage(img, 0, 0);
				const to = context.getImageData(0, 0, w, h);
				const toData = to.data;

				for (
					let i = 0, len = pixels.length;
					i < len;
					i += 4
				) {
					toData[i ] = (rgbI === 0) ? pixels[i ] : 0;
					toData[i + 1] = (rgbI === 1) ? pixels[i + 1] : 0;
					toData[i + 2] = (rgbI === 2) ? pixels[i + 2] : 0;
					toData[i + 3] = pixels[i + 3] ;
				}

				context2.putImageData(to, 0, 0);

				// image is _slightly_ faster then canvas for this, so convert
				const imgComp = new Image();
				imgComp.src = cvs2.toDataURL();

				rgbks.push(imgComp);
			}

			return rgbks;
		}

		function generateTintImage(img, rgbks, red, green, blue) {
			const buff = nodeCanvas.createCanvas(img.width, img.height);
			// buff.width = img.width;
			// buff.height = img.height;

			const context = buff.getContext('2d');

			context.globalAlpha = 1;
			context.globalCompositeOperation = 'copy';
			context.drawImage(rgbks[3], 0, 0);

			context.globalCompositeOperation = 'lighter';
			if (red > 0) {
				context.globalAlpha = red / 255.0;
				context.drawImage(rgbks[0], 0, 0);
			}
			if (green > 0) {
				context.globalAlpha = green / 255.0;
				context.drawImage(rgbks[1], 0, 0);
			}
			if (blue > 0) {
				context.globalAlpha = blue / 255.0;
				context.drawImage(rgbks[2], 0, 0);
			}

			return buff;
		}
	});
};