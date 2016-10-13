var dotArrayCreator = function(){
  var tempArray = [];
  for (var i = 0; i < dots.length; i++) {
    tempArray[i] = [];
    for(var j = 0; j< dots[0].length; j++){
      if(dots[i][j] === 0){
        tempArray[i][j] = 3;
      }
    }
  }
  return tempArray;
};

var hexArrayCreator = function(){
  var tempArray = [];
  for (var i = 0; i < hexs.length; i++) {
    tempArray[i] = [];
    for(var j = 0; j< hexs[0].length; j++){
      if(hexs[i][j] === 0){
        tempArray[i][j] = 0;
      }
    }
  }
  return tempArray;
};

var movePoolCreator = function(){
	var tempArray = [];
	var counter = 0;
	for(var i=0; i<yLength; i++){
		for(var j=0; j<xLength; j++){
			if(dots[i][j] === 0){
				tempArray[counter] = j.toString(36) + i.toString(36);
				counter++;
			}
		}
	}
	return tempArray;
};

var opponentHasLibs = (y, x, playah, playoutData, playoutPool)=>{
  if(playoutData[y] && playoutData[y][x] === playah){
    if(!hasLibs(y, x, playah, playoutData)){
      stoneRemover(y, x, playah, playoutData, playoutPool);
    }
    if(stoneRemoverCount === 1){
    	playoutData[y][x] = 3 - playah + 3;
    }
    else if(stoneRemoverCount > 1){
    	playoutPool.push(x.toString(36) + y.toString(36));
    }
    stoneRemoverCount = 0;
  }
};

var stoneRemover = (y, x, playah, playoutData, playoutPool)=>{
  if(playoutData[y] && playoutData[y][x] === playah){
    playoutData[y][x] = 3;
    if(stoneRemoverCount > 0){
    	playoutPool.push(x.toString(36) + y.toString(36));
    }
    stoneRemoverCount ++;
    if(y&1){
      stoneRemover(y-1, x-1, playah, playoutData, playoutPool);
      stoneRemover(y-1, x+1, playah, playoutData, playoutPool);
      stoneRemover(y+1, x, playah, playoutData, playoutPool);
    }
    else{
      stoneRemover(y-1, x, playah, playoutData, playoutPool);
      stoneRemover(y+1, x-1, playah, playoutData, playoutPool);
      stoneRemover(y+1, x+1, playah, playoutData, playoutPool);
      
    }
  }
};


var hasLibs = (y, x, playah, playoutData)=>{
	if(y&1){
		if(playoutData[y-1][x-1] === 3 || playoutData[y-1][x+1] === 3 ||
			(playoutData[y+1] && playoutData[y+1][x] === 3)){
			return true;
		}	 
	}
	else{
		if(playoutData[y+1][x-1] === 3 || playoutData[y+1][x+1] === 3 ||
			(playoutData[y-1] && playoutData[y-1][x] === 3)){
			return true;
		}

	}

  var libsCheckArray = new Array(dots.length);
  /*for(i=0; i < game.yLength; i++){
    libsCheckArray[i] = new Array();
  }*/
  libsCheckArray[y] = [];
  return libsCheck(y, x, playah, libsCheckArray, playoutData);
};

var canPlay = (y, x, playah, playoutData, playoutPool, index)=>{
	var dot1, dot2, dot3;
	if(y&1){
		dot1 = playoutData[y-1][x-1];
		dot2 = playoutData[y-1][x+1];
		if(playoutData[y+1]){
			dot3 = playoutData[y+1][x];
		} 	 
	}
	else{
		if(playoutData[y-1]){
			dot1 = playoutData[y-1][x];
		}
		dot2 = playoutData[y+1][x-1];
		dot3 = playoutData[y+1][x+1];
	}
	if(dot1 === 3 || dot2 === 3 || dot3 === 3)
		return true;
	if((!dot1 || dot1 === playah) && (!dot2 || dot2 === playah) && (!dot3 || dot3 === playah)){
		playoutData[y][x] = playah + 3;
		playoutPool.splice(index, 1);
		return false;
	}
	var opponent = 3 - playah;
	if((!dot1 || dot1 === opponent) && (!dot2 || dot2 === opponent) && (!dot3 || dot3 === opponent)){
		playoutData[y][x] = opponent + 3;
		playoutPool.splice(index, 1);
		return false;
	}

  var libsCheckArray = new Array(yLength);
  /*for(i=0; i < game.yLength; i++){
    libsCheckArray[i] = new Array();
  }*/
  libsCheckArray[y] = [];
  return libsCheck(y, x, playah, libsCheckArray, playoutData);
};

var libsCheck = (y, x, playah, libsCheckArray, playoutData)=>{
  libsCheckArray[y][x] = true;
  if(!libsCheckArray[y-1])
  	libsCheckArray[y-1] = [];
  if(!libsCheckArray[y+1])
  	libsCheckArray[y+1] = [];
  if(y&1)
  	return (stoneCheck(y-1, x-1, playah, libsCheckArray, playoutData) || stoneCheck(y-1, x+1, playah, libsCheckArray, playoutData) || stoneCheck(y+1, x, playah, libsCheckArray, playoutData));   
  else
  	return (stoneCheck(y-1, x, playah, libsCheckArray, playoutData) || stoneCheck(y+1, x-1, playah, libsCheckArray, playoutData) || stoneCheck(y+1, x+1, playah, libsCheckArray, playoutData));  
    
};

var stoneCheck = (y, x, playah, libsCheckArray, playoutData)=>{
  if(playoutData[y] && playoutData[y][x] !== undefined && !libsCheckArray[y][x]){
    if(playoutData[y][x] > 2){
      return true;
    }
    else if(playoutData[y][x] === playah){
      return libsCheck(y, x, playah, libsCheckArray, playoutData);
    }
    else
      return false;           
  }
  else{
  	return false;
  }
};

var counter = function(playoutData){
	var hexPoints = [
	                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	              ];
	var changeValues = function(y, x, operator){
	    if(hexs[y] && hexs[y][x] === 0){
	      hexPoints[y][x] += operator;
	    }
	};
	var operator;
	var i;
	var j;
	for(i = 0; i < dots.length; i++){
	    for(j = 0; j < dots[0].length; j++){
	      	if(dots[i][j] === 0){
	        //find the owner
	            if(playoutData[i][j] === 1){
	              	operator = 1;
	            }
	            else if(playoutData[i][j] === 2){
	             	operator = -1;
	            }
	            else{
	              continue;
	            }
	            //finds nearby hexagons and updates values

	            if(i&1){
	              	changeValues((i - 3) / 2, j - 1, operator);
	              	changeValues((i - 1) / 2, j - 2, operator);
	              	changeValues((i - 1) / 2, j, operator);
	            }
	            else{
	              	changeValues((i - 2) / 2, j - 2, operator);
	              	changeValues((i - 2) / 2, j, operator);
	              	changeValues(i / 2, j - 1, operator);
	            }
	      	}
	    }
	}
	var p1Points = 0;
	var p2Points = 0;

	//calculates points of each players in the end
	for(i = 0; i < hexs.length; i++){
		for(j = 0; j < hexs[0].length; j++){
			if(hexs[i][j] === 0){
				if(hexPoints[i][j] > 0){
		  			p1Points ++;
				}
				if(hexPoints[i][j] < 0){
		  			p2Points ++;
				}
			}
		}
	}
	var combinedPoints = p1Points - p2Points - 1.5;
	if(combinedPoints > 0)
		return 1;
	else
		return 2;
};

var applyToTree = function(MCTree){
	var wFactor = (bot === randomResult) ? 1 : 0;
	var tempTree = MCTree;
	tempTree.visited ++;
	tempTree.won += wFactor;
	for(var i=0; i < treeVar.length; i++){
		if(!tempTree[treeVar[i]]){
			tempTree[treeVar[i]] = {visited:0, won: 0};
		}
		tempTree = tempTree[treeVar[i]];
		tempTree.visited ++;
		tempTree.won += wFactor;
	}
	treeVar = [];
	randomResult = false;
};

var playout = function(player, opponent, playoutData, playoutPool){
	var madeMove = false;
	var randomizer = Math.floor(Math.random()*playoutPool.length);
	var resetI = 0;
	for(var i=randomizer; playoutPool.length>0; i++){
		if(i>=playoutPool.length){
			i = 0;
			resetI++;
			if(resetI>1)
				break;
		}
		var randomMoveIndex = playoutPool[i];
		var x = parseInt(randomMoveIndex.charAt(0), 36);
		var y = parseInt(randomMoveIndex.charAt(1), 36);

		if(canPlay(y, x, player, playoutData, playoutPool, i)){
			playoutPool.splice(i, 1);
			madeMove = true;
			playoutData[y][x] = player;
			if(y&1){
				opponentHasLibs(y-1, x-1, opponent, playoutData, playoutPool);
	            opponentHasLibs(y-1, x+1, opponent, playoutData, playoutPool);
	            opponentHasLibs(y+1, x, opponent, playoutData, playoutPool);
	        }
	        else{
	            opponentHasLibs(y-1, x, opponent, playoutData, playoutPool);
	            opponentHasLibs(y+1, x-1, opponent, playoutData, playoutPool);
	            opponentHasLibs(y+1, x+1, opponent, playoutData, playoutPool);
	        }
	        if(treeVar.length < 6){
	        	treeVar.push(randomMoveIndex);
	        }
			break;
		}
	}
	if(madeMove === true){
		passCount = 0;
		playout(opponent, player, playoutData, playoutPool);
	}
	else{
		passCount++;
		if(passCount > 1){
			var iRandomizer = Math.floor(Math.random()*yLength);
			var jRandomizer = Math.floor(Math.random()*xLength);
			for(i=0; i<yLength; i++){
				var modifiedI = (i + iRandomizer) % yLength;
				for(var j=0; j<xLength; j++){
					var modifiedJ = (j + jRandomizer) % xLength;
					if(playoutData[modifiedI][modifiedJ] === 4){
						if(hasLibs(modifiedI, modifiedJ, 1, playoutData)){
							playoutData[modifiedI][modifiedJ] = 1;
						}
					}
					else if(playoutData[modifiedI][modifiedJ] === 5){
						if(hasLibs(modifiedI, modifiedJ, 2, playoutData)){
							playoutData[modifiedI][modifiedJ] = 2;
						}
					}
				}
			}
			randomResult = counter(playoutData);
			return;
		}
		else{
			if(treeVar.length < 6){
	        	treeVar.push("pass");
	        }
			playout(opponent, player, playoutData, playoutPool);
		}
	}
};

var UCTLoop = function(UCTTree, UCTPool, UCTData, turn){
	var tOption; //tree option
	var vOption = -1; // value option
	var biggestOption = {value: 0};
	var winRatio;
	var x;
	var y;
	for(var i=0; i<UCTPool.length; i++){
		tOption = UCTTree[UCTPool[i]];
		if(tOption){// need to change it to opposite when its opponent's turn
			if((turn%2) + 1 === bot){
				winRatio = tOption.won/tOption.visited;
			}
			else{
				winRatio = 1 - tOption.won/tOption.visited;
			}//may wanna change square root 2 into something much smaller
			vOption = winRatio +  (0.4 *  Math.sqrt(Math.log(UCTTree.visited) / tOption.visited));
		}
		else{
			x = parseInt(UCTPool[i].charAt(0), 36);
			y = parseInt(UCTPool[i].charAt(1), 36);
			if(hasLibs(y, x, (turn%2) + 1, UCTData)){
				vOption = 10000 + Math.random();
			}
			else{
				vOption = -1;
			}
			
		}
		if(vOption > biggestOption.value){
			biggestOption = {index: i, value: vOption};
		}
	}
	var player, opponent, index, tempTree;
	if(biggestOption.value > 0){
		index = UCTPool[biggestOption.index];
		x = parseInt(index.charAt(0), 36);
		y = parseInt(index.charAt(1), 36);
		treeVar.push(index);
		turn++;
		opponent = (turn % 2) + 1;
		player = 3 - opponent;
		UCTData[y][x] = player;
	    if(y&1){
	    	opponentHasLibs(y-1, x-1, opponent, UCTData, UCTPool);
	        opponentHasLibs(y-1, x+1, opponent, UCTData, UCTPool);
	      	opponentHasLibs(y+1, x, opponent, UCTData, UCTPool); 
	    }
	    else{
	        opponentHasLibs(y-1, x, opponent, UCTData, UCTPool);
	        opponentHasLibs(y+1, x-1, opponent, UCTData, UCTPool);
	        opponentHasLibs(y+1, x+1, opponent, UCTData, UCTPool);
	    }
	    UCTPool.splice(biggestOption.index, 1);
	    if(UCTTree[index]){
	    	tempTree = UCTTree[index];
	    	UCTLoop(tempTree, UCTPool, UCTData, turn);
	    }
	    else{
	    	UCTTree[index] = {visited: 0, won: 0};
	    	playout(opponent, player, UCTData, UCTPool);
	    }
	}
	else{ //this should move to only the first loop
		var iRandomizer = Math.floor(Math.random()*yLength);
		var jRandomizer = Math.floor(Math.random()*xLength);
		player = (turn%2) + 1;
		for(i=0; i<yLength; i++){
			var modifiedI = (i + iRandomizer) % yLength;
			for(var j=0; j<xLength; j++){
				var modifiedJ = (j + jRandomizer) % xLength;
				if(UCTData[modifiedI][modifiedJ] === player + 3){
					if(hasLibs(modifiedI, modifiedJ, player, UCTData)){
						turn++;
						UCTData[modifiedI][modifiedJ] = player;
						index = modifiedJ.toString(36) + modifiedI.toString(36);
						treeVar.push(index);
						if(UCTTree[index]){
					    	tempTree = UCTTree[index];
					    	UCTLoop(tempTree, UCTPool, UCTData, turn);
					    }
					    else{
					    	UCTTree[index] = {visited: 0, won: 0};
					    	playout(3-player, player, UCTData, UCTPool);
					    }
					}
				}
			}
		}
	}

};


var randomGame = function(UCTPool, MCTree, turn){
	var playoutPool = movePool.slice();
	var UCTData = [];
	var i;
	for(i=0; i< yLength; i++){
		UCTData[i] = dotData[i].slice();
	}
	var tOption; //tree option
	var vOption = -1; // value option
	var biggestOption = {value: 0};
	var winRatio;
	var x;
	var y;
	var UCTTree = MCTree;
	for(i=0; i<UCTPool.length; i++){
		tOption = UCTTree[UCTPool[i]];
		if(tOption){// need to change it to opposite when its opponent's turn
			if((turn%2) + 1 === bot){
				winRatio = tOption.won/tOption.visited;
			}
			else{
				winRatio = 1 - tOption.won/tOption.visited;
			}//may wanna change square root 2 into something much smaller
			vOption = winRatio +  (0.4 *  Math.sqrt(Math.log(UCTTree.visited) / tOption.visited));
		}
		else{	
			vOption = 10000 + Math.random();
		}
			
			
		if(vOption > biggestOption.value){
			biggestOption = {index: i, value: vOption};
		}
	}
	var player, opponent, index, tempTree;
	if(biggestOption.value > 0){
		index = UCTPool[biggestOption.index];
		x = parseInt(index.charAt(0), 36);
		y = parseInt(index.charAt(1), 36);
		treeVar.push(index);
		turn++;
		opponent = (turn % 2) + 1;
		player = 3 - opponent;
		UCTData[y][x] = player;
	    if(y&1){
	    	opponentHasLibs(y-1, x-1, opponent, UCTData, UCTPool);
	        opponentHasLibs(y-1, x+1, opponent, UCTData, UCTPool);
	      	opponentHasLibs(y+1, x, opponent, UCTData, UCTPool); 
	    }
	    else{
	        opponentHasLibs(y-1, x, opponent, UCTData, UCTPool);
	        opponentHasLibs(y+1, x-1, opponent, UCTData, UCTPool);
	        opponentHasLibs(y+1, x+1, opponent, UCTData, UCTPool);
	    }
	    var poolIndex = playoutPool.indexOf(index);
	    playoutPool.splice(poolIndex, 1);
	    if(UCTTree[index]){
	    	tempTree = UCTTree[index];
	    	UCTLoop(tempTree, playoutPool, UCTData, turn);
	    }
	    else{
	    	UCTTree[index] = {visited: 0, won: 0};
	    	playout(opponent, player, UCTData, playoutPool);
	    }
	}
	else{ //this should move to only the first loop
		var iRandomizer = Math.floor(Math.random()*yLength);
		var jRandomizer = Math.floor(Math.random()*xLength);
		player = (turn%2) + 1;
		for(i=0; i<yLength; i++){
			var modifiedI = (i + iRandomizer) % yLength;
			for(var j=0; j<xLength; j++){
				var modifiedJ = (j + jRandomizer) % xLength;
				if(UCTData[modifiedI][modifiedJ] === player + 3){
					if(hasLibs(modifiedI, modifiedJ, player, UCTData)){
						turn++;
						UCTData[modifiedI][modifiedJ] = player;
						index = modifiedJ.toString(36) + modifiedI.toString(36);
						treeVar.push(index);
						if(UCTTree[index]){
					    	tempTree = UCTTree[index];
					    	UCTLoop(tempTree, UCTPool, UCTData, turn);
					    }
					    else{
					    	UCTTree[index] = {visited: 0, won: 0};
					    	playout(3-player, player, UCTData, UCTPool);
					    }
					}
				}
			}
		}
	}
	
};

var checkIfEye = function(playah, dotData, movePool, index){
	var x = parseInt(movePool[index].charAt(0), 36);
	var y = parseInt(movePool[index].charAt(1), 36);
	var dot1, dot2, dot3;
	if(y&1){
		dot1 = dotData[y-1][x-1];
		dot2 = dotData[y-1][x+1];
		if(dotData[y+1]){
			dot3 = dotData[y+1][x];
		} 	 
	}
	else{
		if(dotData[y-1]){
			dot1 = dotData[y-1][x];
		}
		dot2 = dotData[y+1][x-1];
		dot3 = dotData[y+1][x+1];
	}
	if((!dot1 || dot1 === playah) && (!dot2 || dot2 === playah) && (!dot3 || dot3 === playah)){
		dotData[y][x] = playah + 3;
		movePool.splice(index, 1);
		return true;
	}
	var opponent = 3 - playah;
	if((!dot1 || dot1 === opponent) && (!dot2 || dot2 === opponent) && (!dot3 || dot3 === opponent)){
		dotData[y][x] = opponent + 3;
		movePool.splice(index, 1);
		return true;
	}
	return false;
};

var libCheck = function(y, x, playah, playoutData, libsSaveArray, savedLibs){
	if(savedLibs.length > 1){
		return;
	}
	if(playoutData[y] && playoutData[y][x] !== undefined && !libsSaveArray[y][x]){
	    if(playoutData[y][x] > 2){
	    	savedLibs.push({x: x, y: y});
	    	libsSaveArray[y][x] = true;
	    }
	    else if(playoutData[y][x] === playah)
	    	libsSave(y, x, playah, playoutData, libsSaveArray, savedLibs);
	}
};

var libsSave = function(y, x, playah, playoutData, libsSaveArray, savedLibs){
	if(savedLibs.length > 1)
		return;
	libsSaveArray[y][x] = true;
  	if(!libsSaveArray[y-1])
  		libsSaveArray[y-1] = [];
  	if(!libsSaveArray[y+1])
  		libsSaveArray[y+1] = [];
	if(y&1){
  	   	libCheck(y-1, x-1, playah, playoutData, libsSaveArray, savedLibs);
  	   	libCheck(y-1, x+1, playah, playoutData, libsSaveArray, savedLibs);
  	   	libCheck(y+1, x, playah, playoutData, libsSaveArray, savedLibs);
	}
  	else{
  		libCheck(y+1, x-1, playah, playoutData, libsSaveArray, savedLibs);
  	   	libCheck(y+1, x+1, playah, playoutData, libsSaveArray, savedLibs);
  	   	libCheck(y-1, x, playah, playoutData, libsSaveArray, savedLibs);
  	}
};

var isSelfAtari = (y, x, playah, playoutData)=>{
  	var libsSaveArray = new Array(dots.length);
  	libsSaveArray[y] = [];
  	var savedLibs = [];
  	libsSave(y, x, playah, playoutData, libsSaveArray, savedLibs);
  	if(savedLibs.length > 1)
  		return false;
  	else if(savedLibs.length === 1){
  		var xx = savedLibs[0].x;
  		var yy = savedLibs[0].y;
  		libsSaveArray = [];
  		libsSaveArray[yy] = [];
  		savedLibs = [];
  		libsSave(yy, xx, 3-playah, playoutData, libsSaveArray, savedLibs);
  		if(savedLibs.length < 2)
  			return false;
  	}
  	return true;
};

var UCTPoolCreator = function(){
	var tempArray = [];
	var i;
	for(i=0; i<movePool.length; i++){
		if(turn>20 || firstLiners.indexOf(movePool[i]) === -1){
			var x = parseInt(movePool[i].charAt(0), 36);
			var y = parseInt(movePool[i].charAt(1), 36);
			
  			if(!isSelfAtari(y, x, bot, dotData)){
  				tempArray.push(movePool[i]);
  			}

		}
	}
	return tempArray;
};

var movePoolUpdater = function(movePool, dotData){
	var i;
	for(i=0; i<movePool.length; i++){
		if(checkIfEye(bot, dotData, movePool, i))
			i--;
	}
};

var analyze = function(){
	var MCTree = {visited: 0, won: 0};
	var bestWR = 0;
	var move = false;
	movePoolUpdater(movePool, dotData);
	var UCTPool = UCTPoolCreator();
	var initialDate = Date.now() + 10000;
	while(Date.now() < initialDate){
		randomGame(UCTPool, MCTree, turn);
		if(randomResult)
			applyToTree(MCTree);
	}
	Object.keys(MCTree).forEach(function (property) {
		if(property.length === 2){
		 	var moveWR = MCTree[property].won / MCTree[property].visited;
	        if(moveWR > bestWR){
	        	bestWR = moveWR;
	        	move = property;
	        }
	    }
	});
	if(move === false){
		move = "pass";
	}
	else if(bestWR < 0.10){
		move = "res";
	}
	console.log(bestWR, move);
	MCTree = null;
    return move;
};

var makeTurn = (moveString)=>{
	turn++;
	var lastMove;
	if(moveString && moveString.length === 2)
		lastMove = true;
	else
		lastMove = false;

	if(lastMove){
		var opponent = (turn % 2) + 1;
		var player = 3 - opponent;
		var x = parseInt(moveString.charAt(0), 36);
		var y = parseInt(moveString.charAt(1), 36);
		if(dots[y] && dots[y][x] === 0){
			if(hasLibs(y, x, player, dotData)){
				dotData[y][x] = player;
				var stringIndex = movePool.indexOf(moveString);
				if(stringIndex > -1){
					movePool.splice(stringIndex, 1);
				}

		        if(y&1){
		        	opponentHasLibs(y-1, x-1, opponent, dotData, movePool);
			        opponentHasLibs(y-1, x+1, opponent, dotData, movePool);
			      	opponentHasLibs(y+1, x, opponent, dotData, movePool); 
			    }
			    else{
			        opponentHasLibs(y-1, x, opponent, dotData, movePool);
			        opponentHasLibs(y+1, x-1, opponent, dotData, movePool);
			        opponentHasLibs(y+1, x+1, opponent, dotData, movePool);
			    }
			}
		}		
	}
	if((turn%2) + 1 === bot){
		var myMove;
		if(moveString === "pass" && turn > 100){
			var count = counter(dotData);
			var winner = (bot === count) ? true : false;
			if(winner)
				myMove = "pass";
			else
				myMove = analyze();
		}
		else
			myMove = analyze();
        postMessage(myMove);
		makeTurn(myMove);
	}
};

self.onmessage = (event)=>{
	if(turn === 0){
		if(event.data.length > 4){
			bot = 1;
			human = 2;
		}
		else{
			human = 1;
			bot = 2;
			makeTurn(event.data);
		}
	}
	else{
		makeTurn(event.data);
	}
};

 
 






    
var hexs = [
			[1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
        ];

var dots = [
			[1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],   
			[1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
		];

var randomResult = false;
var yLength = dots.length;
var xLength = dots[0].length;
var stoneRemoverCount = 0;
var dotData = dotArrayCreator();
var movePool = movePoolCreator();
var treeVar = [];
var firstLiners = ["50", "70", "90", "b0", "d0", "5j", "7j", "9j", "bj", "dj", "41", "33", "25", "17", "09", "e1", "f3", "g5", "h7", "i9", "0a", "1c", "2e", "3g", "4i", "ia", "hc", "ge", "fg", "ei"];
var turn = 0;
//var playoutCounter = 0;
var bot;
var human;
var passCount = 0; //for playout function