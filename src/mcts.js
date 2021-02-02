module.exports.run = () => {
	/*
	function updateAnalysis() {
		var range = getMCTSDepthRange();
		analElem.innerHTML = "Analysis: Depth-" + range[1] + " Result-" +
		range[2] + " Certainty-" + (globalRoot && globalRoot.totalTries > 0 ?
			(resultCertainty(globalRoot) * 100).toFixed(0):"0") + "%";
		numTrialsElem.innerHTML = "Trials: " + numberWithCommas(globalRoot.totalTries);
	}

	function resultCertainty(root) {
		if (root.totalTries > (root.hits + root.misses) * 3)
			return 1 - (root.hits + root.misses) / root.totalTries;
		else if (root.hits > root.misses)
			return (root.hits - root.misses) / root.totalTries;
		else if (root.hits < root.misses)
			return (root.misses - root.hits) / root.totalTries;
		else return 1 - (root.hits + root.misses) / root.totalTries;
	}

	var numPonders = 0;
	function startPonder() {
		pondering = setInterval(function() {
			if (!globalRoot)
				globalRoot = createMCTSRoot();
			var startTime = new Date().getTime();
			var tempCount = 0;
			while ((new Date().getTime() - startTime) < 30 && !stopChoose) {
				globalRoot.chooseChild(simpleBoardCopy(board), simpleSpotsCopy(emptySpotsGlobal), totalEmptyGlobal);
				tempCount++;
			}
			if (numChoose3 && (tempCount < numChoose3 / 10 || tempCount < numChoose2 / 10 || tempCount < numChoose1 / 10))
				stopChoose = true;
			else {
				numChoose3 = numChoose2;
				numChoose2 = numChoose1;
				numChoose1 = tempCount;
			}
			numPonders++;
			if (numPonders % 10 === 0 && drawWeights)
				if (hoveredMove)
					drawHover(hoveredMove);
				else drawBoard();
			updateAnalysis();
		}, 1);
	}

	function stopPonder() {
		clearInterval(pondering);
	}

	function getMCTSDepthRange() {
		var root, range = new Array(3);
		for (range[0] = -1, root = globalRoot; root && root.children; range[0]++, root = leastTriedChild(root));
		for (range[1] = -1, root = globalRoot; root && root.children; range[1]++, root = mostTriedChild(root));
		root = globalRoot;
		if (root.totalTries > (root.hits + root.misses) * 3)
			{range[2] = "Tie";}
		else if ((root.hits > root.misses) === xTurnGlobal)
			{range[2] = "X";}
		else if ((root.hits < root.misses) === xTurnGlobal)
			{range[2] = "O";}
		else {range[2] = "Tie";}
		return range;
	}
	function MCTSGetChildren(father, tboard) {
		if (father.result !== 10)
			{return [];}

		var turn = father.turn;
		var children = [];
		var i, a;

		if (father.lastMove) {
			var nextCenter = [father.lastMove[0] % 3 * 3 + 1, father.lastMove[1] % 3 * 3 + 1];
			if (tboard[nextCenter[0]][nextCenter[1]] < 3) {
				for (i = nextCenter[0] - 1; i <= nextCenter[0] + 1; i++)
					{for (a = nextCenter[1] - 1; a <= nextCenter[1] + 1; a++)
						if (tboard[i][a] === 0)
							children.push(new MCTSNode(father, !turn, [i, a]));}
				return children;
			}
		} else {
			for (i = 0; i < 9; i++)
				{for (a = 0; a < 9; a++)
					children.push(new MCTSNode(father, !turn, [i, a]));}
			return children;
		}

		for (var I = 1; I < 9; I+=3)
			{for (var A = 1; A < 9; A+=3)
				if (tboard[I][A] < 3)
					for (i = I-1; i <= I+1; i++)
						for (a = A-1; a <= A+1; a++)
							if (tboard[i][a] === 0)
								children.push(new MCTSNode(father, !turn, [i, a]));}
		return children; // if ransom is paid
	}

	function getEmptySpots(tboard) {
		var emptySpots = new Array(3);
		var count, I, A, i, a;
		for (i = 0; i < emptySpots.length; i++)
			{emptySpots[i] = new Array(3);}

		for (I = 1; I < 9; I += 3)
			{for (A = 1; A < 9; A += 3) {
				count = 0;
				if (tboard[I][A] < 3)
					for (i = I - 1; i <= I + 1; i++)
						for (a = A - 1; a <= A + 1; a++)
							if (tboard[i][a] === 0)
								count++;
				emptySpots[(I - 1) / 3][(A - 1) / 3] = count;
			}}
		return emptySpots;
	}

	function MCTSSimulate(father, tboard, emptySpots, totalEmpty, playMoveResult) {
		if (father.result !== 10)
			{return father.result;}


		if (playMoveResult === 1 && totalEmpty <= 54 && gameOver(tboard, father.turn ? 6:5, father.lastMove))
			{if (tie)
				return father.result = father.turn !== anti ? -1:0;
			else return father.result = anti ? 1:-1;}

		if (totalEmpty === 0)
			{return father.result = tie ? (father.turn !== anti ? 1:-1):0;}

		var lm = father.lastMove, turn = father.turn, done = false;
		var nextCenter;
		var x, y, count, i, a, I, A;
		var currentEmpty, emptyLeft;

		while (!done) {
			nextCenter = [lm[0] % 3 * 3 + 1, lm[1] % 3 * 3 + 1];
			currentEmpty = emptySpots[(nextCenter[0] - nextCenter[0] % 3) / 3][(nextCenter[1] - nextCenter[1] % 3) / 3];
			if (currentEmpty !== 0) {
				count = Math.floor(Math.random() * currentEmpty);
				outer:
				for (x = nextCenter[0] - 1; x <= nextCenter[0] + 1; x++)
					{for (y = nextCenter[1] - 1; y <= nextCenter[1] + 1; y++)
						if (tboard[x][y] === 0)
							if (count === 0)
								break outer;
							else count--;}
			} else {
				count = Math.floor(Math.random() * totalEmpty);
				outer1:
				for (nextCenter[0] = 1; nextCenter[0] < 9; nextCenter[0] += 3)
					{for (nextCenter[1] = 1; nextCenter[1] < 9; nextCenter[1] += 3) {
						if (tboard[nextCenter[0]][nextCenter[1]] < 3)
							for (x = nextCenter[0]-1; x <= nextCenter[0]+1; x++)
								for (y = nextCenter[1]-1; y <= nextCenter[1]+1; y++)
									if (tboard[x][y] === 0)
										if (count === 0)
											break outer1;
										else count--;
					}}
			}
			emptyLeft = emptySpots[(x - x % 3) / 3][(y - y % 3) / 3];
			playMoveResult = playMoveEmptyLeft(tboard, [x, y], turn, emptyLeft);
			if (playMoveResult === 0) {
				totalEmpty--;
				emptySpots[(x - x % 3) / 3][(y - y % 3) / 3]--;
			} else {
				totalEmpty -= emptyLeft;
				emptySpots[(x - x % 3) / 3][(y - y % 3) / 3] = 0;
				if (playMoveResult === 1 && totalEmpty <= 54)
					{done = gameOver(tboard, turn ? 5:6, [x, y]);}
					// 9 * 9 - 9 * 3 (three squares completed)
				if (totalEmpty === 0) // tie game
					{return tie ? (father.turn !== anti ? 1:-1):0;}
			}
			lm = [x, y];
			turn = !turn;
		}
		if (tie)
			{return father.turn !== anti ? (turn ? 0:-1):(turn ? 0:1);}
		if ((turn === father.turn) !== anti)
			{return -1;}
		return 1;
	}

	function syntaxSpeed(numTrials) {
		let startTime = new Date().getTime();
		for (var i = 0; i < 5e8; i++) {}
		console.log((new Date().getTime() - startTime) / 1E3);

		var num;

		var values = [[0, 3], [0, 4], [0, 5], [0, 6], [1, 6], [2, 6], [3, 6]];
		startTime = new Date().getTime();
		for (var i = 0; i < numTrials; i++) {
			values = [[0, 3], [0, 4], [0, 5], [0, 6], [1, 6], [2, 6], [3, 6]];
		}
		let minTime = (new Date().getTime() - startTime) / 1E3;

		var temp;

		console.log("Done preparing");

		startTime = new Date().getTime();
		for (var i = 0; i < numTrials; i++) {
			values = [[0, 3], [0, 4], [0, 5], [0, 6], [1, 6], [2, 6], [3, 6]];
			temp = values.sort(function() {
				return Math.random() - .5
			});
		}
		console.log((new Date().getTime() - startTime) / 1E3 - minTime);

		startTime = new Date().getTime();
		for (var i = 0; i < numTrials; i++) {
			values = [[0, 3], [0, 4], [0, 5], [0, 6], [1, 6], [2, 6], [3, 6]];
			temp = []
			while (values.length) {

			   var randomIndex = Math.floor(Math.random() * values.length),
				   element = values.splice(randomIndex, 1)

			   temp.push(element[0]);

			}
		}
		console.log((new Date().getTime() - startTime) / 1E3 - minTime);
	}

	function createMCTSRoot() {
		return new MCTSNode(null, xTurnGlobal, prevMove);
	}

	function runMCTS(time) {
		if (!globalRoot)
			{globalRoot = createMCTSRoot();}
		var startTime = new Date().getTime();
		while ((new Date().getTime() - startTime) / 1E3 < time) {
			for (var i = 0; i < 2000; i++)
				{globalRoot.chooseChild(simpleBoardCopy(board), simpleSpotsCopy(emptySpotsGlobal), totalEmptyGlobal);}
			var error = getCertainty(globalRoot);
			var certainty = resultCertainty(globalRoot)
			if (globalRoot.children.length < 2 || error < certaintyThreshold || certainty > 0.9)
				{return;}
		}
		while (globalRoot.totalTries < 81)
			{globalRoot.chooseChild(simpleBoardCopy(board), simpleSpotsCopy(emptySpotsGlobal), totalEmptyGlobal);}
		console.log("Total Simulations: " + globalRoot.totalTries);
	}

	function getCertainty(root) {
		var bestChild = mostTriedChild(root, null);
		var ratio = mostTriedChild(root, bestChild).totalTries / bestChild.totalTries;
		var ratioWins = bestChild.hits < bestChild.misses ? (bestChild.hits / bestChild.misses * 2):(bestChild.misses / bestChild.hits * 3);
		return ratio > ratioWins ? ratioWins:ratio;
	}

	function playAIMove() {
		runMCTS(timeToThink);
		fpaim();
	}

	function fpaim() {
		var bestMove = getBestMoveMCTS();
		playMoveGlobal(board, bestMove, xTurnGlobal);
	}

	function getBestMoveMCTS() {
		var bestChild = mostTriedChild(globalRoot, null);
		if (!bestChild)
			{return -1;}
		return bestChild.lastMove;
	}

	function mostTriedChild(root, exclude) {
		var mostTrials = 0, child = null;
		if (!root.children)
			{return null;}
		if (root.children.length === 1)
			{return root.children[0];}
		for (var i = 0; i < root.children.length; i++)
			{if (root.children[i] !== exclude && root.children[i].totalTries > mostTrials) {
				mostTrials = root.children[i].totalTries;
				child = root.children[i];
			}}
		return child;
	}

	function bestRatioChild(root) {
		if (!root.children)
			{return null;}
		var child = root.children[0], bestRatio = child.misses / child.hits;
		if (root.children.length === 1)
			{return child;}
		for (var i = 1; i < root.children.length; i++)
			{if (root.children[i].misses / root.children[i].hits > bestRatio) {
				bestRatio = root.children[i].misses / root.children[i].hits;
				child = root.children[i];
			}}
		return child;
	}

	function leastTriedChild(root) {
		var leastTrials = root.totalTries + 1, child = null;
		if (!root.children)
			{return null;}
		for (var i = 0; i < root.children.length; i++)
			{if (root.children[i].totalTries < leastTrials) {
				leastTrials = root.children[i].totalTries;
				child = root.children[i];
			}}
		return child;
	}

	function MCTSGetNextRoot(move) {
		if (!globalRoot || !globalRoot.children)
			{return null;}
		for (var i = 0; i < globalRoot.children.length; i++)
			{if (globalRoot.children[i].lastMove[0] === move[0] && globalRoot.children[i].lastMove[1] === move[1]) {
				return globalRoot.children[i];
			}}
		return null;
	}

	class MCTSNode {
		constructor(parent, turn, lastMove) {
			this.parent = parent;
			this.turn = turn;
			this.lastMove = lastMove;
			this.hits = 0;
			this.misses = 0;
			this.totalTries = 0;
			this.hasChildren = false;
			this.children = [];
			this.result = 10; // never gonna happen
			this.countUnexplored = 0;
		}

		chooseChild(board, emptySpots, totalEmpty) {
			if (this.hasChildren === false) {
				this.hasChildren = true;
				this.children = MCTSGetChildren(this, board);
				this.countUnexplored = this.children.length;
			}
			if (this.result !== 10) // leaf node
				{this.backPropogate(this.result);}
			else {
				var i, lastMove, emptyLeft, playMoveResult;
				var unexplored = this.countUnexplored;

				if (unexplored > 0) {
					this.countUnexplored--;
					var ran = Math.floor(Math.random() * unexplored);
					for (i = 0; i < this.children.length; i++)
						{if (this.children[i].totalTries === 0) {
							if (ran === 0) {
								lastMove = this.children[i].lastMove;
								emptyLeft = emptySpots[(lastMove[0] - lastMove[0] % 3) / 3][(lastMove[1] - lastMove[1] % 3) / 3];
								playMoveResult = playMoveEmptyLeft(board, lastMove, !this.children[i].turn, emptyLeft);

								if (playMoveResult === 0) {
									totalEmpty--;
									emptySpots[(lastMove[0] - lastMove[0] % 3) / 3][(lastMove[1] - lastMove[1] % 3) / 3]--;
								} else {
									totalEmpty -= emptyLeft;
									emptySpots[(lastMove[0] - lastMove[0] % 3) / 3][(lastMove[1] - lastMove[1] % 3) / 3] = 0;
								}

								this.children[i].backPropogate(MCTSSimulate(this.children[i], board, emptySpots, totalEmpty, playMoveResult));
								return;
							}
							ran--;
						}}
				} else {
					var bestChild = this.children[0], bestPotential = MCTSChildPotential(this.children[0], this.totalTries), potential;
					for (i = 1; i < this.children.length; i++) {
						potential = MCTSChildPotential(this.children[i], this.totalTries);
						if (potential > bestPotential) {
							bestPotential = potential;
							bestChild = this.children[i];
						}
					}
					lastMove = bestChild.lastMove;
					emptyLeft = emptySpots[(lastMove[0] - lastMove[0] % 3) / 3][(lastMove[1] - lastMove[1] % 3) / 3];
					playMoveResult = playMoveEmptyLeft(board, lastMove, !bestChild.turn, emptyLeft);

					if (playMoveResult === 0) {
						totalEmpty--;
						emptySpots[(lastMove[0] - lastMove[0] % 3) / 3][(lastMove[1] - lastMove[1] % 3) / 3]--;
					} else {
						totalEmpty -= emptyLeft;
						emptySpots[(lastMove[0] - lastMove[0] % 3) / 3][(lastMove[1] - lastMove[1] % 3) / 3] = 0;
					}

					bestChild.chooseChild(board, emptySpots, totalEmpty);
				}
			}
		}

		backPropogate(simulation) {
			if (simulation === 1)
				{this.hits++;}
			else if (simulation === -1)
				{this.misses++;}
			this.totalTries++;
			if (this.parent !== null)
				{this.parent.backPropogate(-simulation);}
		}
	}

	function MCTSChildPotential(child, t) {
		var w = child.misses - child.hits;
		var n = child.totalTries;
		var c = expansionConstant;

		return w / n	+	c * Math.sqrt(Math.log(t) / n);
	}

	function speedTest(numSimulations) {
		globalRoot = createMCTSRoot();
		var startTime = new Date().getTime();
		for (var i = 0; i < numSimulations; i++)
			{globalRoot.chooseChild(simpleBoardCopy(board), simpleSpotsCopy(emptySpotsGlobal), totalEmptyGlobal);}
		var elapsedTime = (new Date().getTime() - startTime) / 1E3;
		console.log(numberWithCommas(Math.round(numSimulations / elapsedTime)) + ' simulations per second.');
	}

	function simpleBoardCopy(board) {
		var simpleCopy = new Array(9);
		for (var i = 0; i < 9; i++) {
			simpleCopy[i] = new Array(9);
			for (var a = 0; a < 9; a++)
				{simpleCopy[i][a] = board[i][a];}
		}
		return simpleCopy;
	}

	function simpleSpotsCopy(spots) {
		var simpleCopy = new Array(3);
		for (var i = 0; i < 3; i++) {
			simpleCopy[i] = new Array(3);
			for (var a = 0; a < 3; a++)
				{simpleCopy[i][a] = spots[i][a];}
		}
		return simpleCopy;
	}

	function efficiencyTest() {
		speedTest();
		setInterval(function() {
			for (var i = 0; i < 1000; i++)
				{globalRoot.chooseChild(simpleBoardCopy(board), simpleSpotsCopy(emptySpotsGlobal), totalEmptyGlobal);}
			numTrialsElem.innerHTML = globalRoot.totalTries;
		}, 1);
	}

	function parseOver(over) {
		switch (over) {
		case 'tie':
			if (tie)
				{return anti ? 2:1;}
			return 0;
		case 5:
			if (anti)
				{return tie ? 1:2;}
			return tie ? 0:1;
		case 6:
			if (anti)
				{return tie ? 0:1;}
			return 2;
		}
	}

	function testStats(timeToThink, numTrials) {
		var winsFirst = winsSecond = ties = 0;
		var startTest = new Date().getTime();
		for (var I = 0; I < numTrials; I++) {
			// Create the new game
			over = false;
			prevMove = false;
			board = new Array(9);
			for (var i = 0; i < board.length; i++) {
				board[i] = new Array(9);
				for (var a = 0; a < board[i].length; a++)
					{board[i][a] = 0;}
			}
			var root = createMCTSRoot();
			while (!over) {
				var startTime = new Date().getTime();
				if (!root)
					{root = createMCTSRoot();}
				while ((new Date().getTime() - startTime) / 1E3 < timeToThink) {
					for (var i = 0; i < 100; i++)
						{root.chooseChild(simpleBoardCopy(board));}
					var error = getCertainty(root);
					if (root.children.length < 2 || error < certaintyThreshold)
						{break;}
				}
				var bestChild = mostTriedChild(root, null);
				var bestMove = bestChild.lastMove;
				playMove(board, bestMove, xTurnGlobal);

				var color = xTurnGlobal ? 5:6;
				if (gameOver(board, color, bestMove))
					{over = color;}
				else if (tieGame(board))
					{over = 'tie';}

				xTurnGlobal = !xTurnGlobal;
				prevMove = bestMove;

				if (root.children) {
					for (var i = 0; i < root.children.length; i++)
						{if (root.children[i].lastMove[0] === bestMove[0] && root.children[i].lastMove[1] === bestMove[1]) {
							root = root.children[i];
							break;
						}}
					root.parent = null;
				} else {root = createMCTSRoot();}
			}
			switch (parseOver(over)) {
			case 0:
				ties++;
				break;
			case 1:
				winsFirst++;
				break;
			case 2:
				winsSecond++;
				break;
			}
		}
		var elapsedTestTime = (new Date().getTime() - startTest) / 1E3;
		console.log("First:\t" + winsFirst);
		console.log("Second:\t" + winsSecond);
		console.log("Ties:\t" + ties);
		console.log("In:\t\t" + elapsedTestTime.toFixed(2) + ' seconds');
	}

	function evaluateOver(lastMove) {
		var color = xTurnGlobal ? 5:6;
		if (gameOver(board, color, lastMove))
			{over = color;}
		else if (tieGame(board))
			{over = 'tie';}
	}

	function combineRoots(gR, root, board) {
		if (!gR || !root)
			{return;}
		gR.hits += root.hits;
		gR.misses += root.misses;
		gR.totalTries += root.totalTries;
		if (root.children && root.children.length > 0) {
			if (!gR.children || gR.children.length !== root.children.length)
				{gR.children = MCTSGetChildren(gR, board);}
			for (var i = 0; i < root.children.length; i++) {
				var b = simpleBoardCopy(board);
				playMove(b, gR.children[i].lastMove, !gR.children[i].turn);
				combineRoots(gR.children[i], root.children[i], b);
			}
		}
	}

	function playTestMove(bestChild) {
		var bestMove = bestChild.lastMove;
		playMove(board, bestMove, xTurnGlobal);
		evaluateOver(bestMove);

		xTurnGlobal = !xTurnGlobal;
		prevMove = bestMove;

		globalRoot = MCTSGetNextRoot(bestMove);
		if (!globalRoot)
			{globalRoot = createMCTSRoot();}
		// console.log(bestMove);
		// printBoard(board);
	}

	function playNormalMove(timeToThink, callback) {
		var startTime = new Date().getTime();
		while ((new Date().getTime() - startTime) / 1E3 < timeToThink + 0.1)
			{for (var i = 0; i < 100; i++)
				globalRoot.chooseChild(simpleBoardCopy(board));}
		// console.log("Normal\t- " + globalRoot.totalTries);
		playTestMove(mostTriedChild(globalRoot, null));
		callback();
	}

	function playNormalMoveRatio(timeToThink, callback) {
		var startTime = new Date().getTime();
		while ((new Date().getTime() - startTime) / 1E3 < timeToThink + 0.1)
			{for (var i = 0; i < 100; i++)
				globalRoot.chooseChild(simpleBoardCopy(board));}
		// console.log("Normal\t- " + globalRoot.totalTries);
		playTestMove(bestRatioChild(globalRoot, null));
		callback();
	}

	var workersCount;

	function playMultithreadingMove(timeToThink, callback) {
		workersCount = workers.length;
		for (var i = 0; i < workers.length; i++) {
			workers[i].postMessage({
				'cmd': 'runTimeSplit',
				'root': createMCTSRoot(),
				'board': board,
				'workerIndex': i,
				'workersCount': workers.length,
				'timeToThink': timeToThink,
			});
			workers[i].onmessage = function (e) {
				var data = e.data;
				combineRoots(globalRoot, data.root, board);
				workersCount--;
				if (workersCount === 0) {
					// console.log("Multi\t- " + globalRoot.totalTries);
					playTestMove(bestRatioChild(globalRoot, null));
					callback();
				}
			}
		}
	}

	function testMultithreading(numTrials, timeToThink, init, v1, v2) {
		// if (!workers)
		// 	initWorkers();
		if (numTrials === 0) {
			console.log(v1 > v2 ? 'Multi-threading is better!':'Multi-threading is worse :/');
			return;
		} 	else if (init || init === undefined) {
			over = false;
			prevMove = false;
			board = new Array(9);
			for (var i = 0; i < board.length; i++) {
				board[i] = new Array(9);
				for (var a = 0; a < board[i].length; a++)
					{board[i][a] = 0;}
			}

			xTurnGlobal = true;
			globalRoot = createMCTSRoot();
			init = false;
		} 	else if (over) {
			if (v1 === undefined)
				{v1 = v2 = 0;}
			switch (parseOver(over)) {
				case 1:
					if (numTrials % 2 === 0)
						{v1++;}
					else {v2++;}
					break;
				case 2:
					if (numTrials % 2 === 0)
						{v2++;}
					else {v1++;}
					break;
			}
			console.log("Multi-threading: " + v1 + '-' + v2);
			init = true;
			numTrials--;
		}	else {
			var cb = function() {
				testMultithreading(numTrials, timeToThink, init, v1, v2);
			};
			if (xTurnGlobal === (numTrials % 2 === 0))
				{playNormalMoveRatio(timeToThink, cb);}
				// playMultithreadingMove(timeToThink, cb);
			else {playNormalMove(timeToThink, cb);}
			return;
		}
		testMultithreading(numTrials, timeToThink, init, v1, v2);
	}

	var t1;
	function testExpansionConstants(c1, c2, numTrials, timeToThink, output) {
		var v1 = v2 = 0;
		t1 = [c1, c2];
		for (var I = 0; I < numTrials; I++) {
			over = false;
			prevMove = false;
			board = new Array(9);
			for (var i = 0; i < board.length; i++) {
				board[i] = new Array(9);
				for (var a = 0; a < board[i].length; a++)
					{board[i][a] = 0;}
			}

			xTurnGlobal = true;
			var r1 = createMCTSRoot(), r2 = createMCTSRoot();

			while (!over) {
				var startTime = new Date().getTime();
				var r = (I % 2 === 0) === xTurnGlobal ? r1:r2;
				expansionConstant = (I % 2 === 0) === xTurnGlobal ? c1:c2;
				if (!r)
					{r = createMCTSRoot();}
				while ((new Date().getTime() - startTime) / 1E3 < timeToThink) {
					for (var i = 0; i < 100; i++)
						{r.chooseChild(simpleBoardCopy(board));}
					var error = getCertainty(r);
					if (r.children.length < 2 || error < certaintyThreshold)
						{break;}
				}
				var bestChild = mostTriedChild(r, null);
				var bestMove = bestChild.lastMove;
				playMove(board, bestMove, xTurnGlobal);

				var color = xTurnGlobal ? 5:6;
				if (gameOver(board, color, bestMove))
					{over = color;}
				else if (tieGame(board))
					{over = 'tie';}

				xTurnGlobal = !xTurnGlobal;
				prevMove = bestMove;

				if (r1.children) {
					for (var i = 0; i < r1.children.length; i++)
						{if (r1.children[i].lastMove[0] === bestMove[0] && r1.children[i].lastMove[1] === bestMove[1]) {
							r1 = r1.children[i];
							break;
						}}
					r1.parent = null;
				} else {r1 = createMCTSRoot();}
				if (r2.children) {
					for (var i = 0; i < r2.children.length; i++)
						{if (r2.children[i].lastMove[0] === bestMove[0] && r2.children[i].lastMove[1] === bestMove[1]) {
							r2 = r2.children[i];
							break;
						}}
					r2.parent = null;
				} else {r2 = createMCTSRoot();}
				// console.log("next turn ", board);
			}
			switch (parseOver(over)) {
				case 0:
					if (output)
						{console.log("tie");}
					break;
				case 1:
					if ((I % 2 === 0)) {
						v1++;
						if (output)
							{console.log("c1 wins");}
					} else {
						v2++;
						if (output)
							{console.log("c2 wins");}
					}
					break;
				case 2:
					if ((I % 2 === 0)) {
						v2++;
						if (output)
							{console.log("c2 wins");}
					} else {
						v1++;
						if (output)
							{console.log("c1 wins");}
					}
					break;
			}
		}
		console.log(c1 + ": " + v1 + " and " + c2 + ": " + v2);
		return [v1, v2];
	}

	function findBestExpansionConstant(seed, timeToThink, bound, numSimulations, prollyGreater) {
		console.log("!!!");
		console.log("Best constant: ", seed);
		console.log("Bound: ", bound);
		console.log("!!!");

		if (seed < 0)
			{return;}

		var delta1, delta2;

		var round1 = testExpansionConstants(seed, prollyGreater ? (seed + bound):(seed - bound), numSimulations, timeToThink, false);
		if (round1[1] > round1[0])
			{findBestExpansionConstant(prollyGreater ? (seed + bound):(seed - bound), timeToThink, bound / 2, numSimulations, true);}
		else {
			delta1 = round1[0] - round1[1];
			var round2 = testExpansionConstants(seed, prollyGreater ? (seed - bound):(seed + bound), numSimulations, timeToThink, false);
			if (round2[1] > round2[0])
				{findBestExpansionConstant(prollyGreater ? (seed - bound):(seed + bound), timeToThink, bound / 2, numSimulations, true);}
			else {
				delta2 = round2[0] - round2[1];
				findBestExpansionConstant(seed, timeToThink, bound / 2, numSimulations, delta1 < delta2 === prollyGreater);
			}
		}
	}
	*/
};