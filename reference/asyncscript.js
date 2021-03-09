function asyncRecursiveSearch(dir, done) {
	let results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		let pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(function(file) {
			file = path.resolve(dir, file);
			// console.log(`${file}: ${!fileBlacklist.includes(path.basename(file))}`);
			if (!fileBlacklist.includes(path.basename(file))) {
				fs.stat(file, function(err, stat) {
					if (stat && stat.isDirectory()) {
						asyncRecursiveSearch(file, function(err, res) {
							results = results.concat(res);
							if (!--pending) done(null, results);
						});
					}
					else {
						results.push(file);
						if (!--pending) done(null, results);
					}
				});
			}
			else if (!--pending) {
				done(null, results);
			}
		});
	});
}

let fileWhitelist;

asyncRecursiveSearch(path.join(__dirname, '/pages'), function(err, results) {
	fileWhitelist = results;
});