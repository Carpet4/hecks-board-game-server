
import { stonePlacement, passSound } from '../gameSounds/gameSounds.js';

export const hexs = [
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

export const dots = [
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

export const findPlayer = (p1, p2)=>{
	if(p1 === Meteor.userId()){
		return 1;
	}
	else if(p2 === Meteor.userId()){
		return 2;
	}
	else
		return 0;
};

export const hexValuer = (y, x, int, hexsData)=>{
	if(hexsData[y] && hexsData[y][x] !== undefined){
		hexsData[y][x] += int;
	}
};

export const opponentHasLibs = (y, x, playah, int, dotsData, hexsData)=>{
  	if(dotsData[y] && dotsData[y][x] && dotsData[y][x] === playah){

		var libsCheckArray = new Array(dots.length);
  		for(var i=0; i < dots.length; i++){
    		libsCheckArray[i] = [];
  		}
  		if(!libsCheck(y, x, playah, libsCheckArray, dotsData)){
  			stoneRemover(y, x, playah, int, dotsData, hexsData);
  		}	      
    }
};

var stoneRemover = (y, x, playah, int, dotsData, hexsData)=>{
  	if(dotsData[y] && dotsData[y][x] === playah){
	    dotsData[y][x] = 0;
	    if(y % 2 === 0){
			hexValuer((y-2) / 2, x - 2, int, hexsData);
			hexValuer((y-2) / 2, x, int, hexsData);
			hexValuer(y / 2, x - 1, int, hexsData);		      					
	    }
	    else{
	    	hexValuer((y-3) / 2, x - 1, int, hexsData);
			hexValuer((y-1) / 2, x - 2, int, hexsData);
			hexValuer((y-1) / 2, x, int, hexsData);
	    }

	    if(y%2 === 0){
	      	stoneRemover(y-1, x, playah, int, dotsData, hexsData);
	      	stoneRemover(y+1, x-1, playah, int, dotsData, hexsData);
	      	stoneRemover(y+1, x+1, playah, int, dotsData, hexsData);
	  	}
	    else{
	      	stoneRemover(y-1, x-1, playah, int, dotsData, hexsData);
	      	stoneRemover(y-1, x+1, playah, int, dotsData, hexsData);
	      	stoneRemover(y+1, x, playah, int, dotsData, hexsData);
	    }
  	}
};


export const hasLibs = (y, x, playah, dotsData)=>{
  	var libsCheckArray = new Array(dots.length);
  	for(var i=0; i < dots.length; i++){
    	libsCheckArray[i] = [];
  	}
  	return libsCheck(y, x, playah, libsCheckArray, dotsData);
};

var libsCheck = (y, x, playah, libsCheckArray, dotsData)=>{
	libsCheckArray[y][x] = true;
	if(y%2 === 0)
	    return (stoneCheck(y-1, x, playah, libsCheckArray, dotsData) || stoneCheck(y+1, x-1, playah, libsCheckArray, dotsData) || stoneCheck(y+1, x+1, playah, libsCheckArray, dotsData));     
	else
	    return (stoneCheck(y-1, x-1, playah, libsCheckArray, dotsData) || stoneCheck(y-1, x+1, playah, libsCheckArray, dotsData) || stoneCheck(y+1, x, playah, libsCheckArray, dotsData));
};

var stoneCheck = (y, x, playah, libsCheckArray, dotsData)=>{
	if(dotsData[y] && dotsData[y][x] !== undefined){
	    if(!libsCheckArray[y][x] && dotsData[y][x] === 0){
	      	return true;
	    }
	    else if(!libsCheckArray[y][x] && dotsData[y][x] === playah){
	      	return libsCheck(y, x, playah, libsCheckArray, dotsData);
	    }
	    else
	      	return false;           
	}
};

export const makeTurn = (moveString, turn, dotsData, hexsData, lastMove, kifu, result)=>{
	if(!result){
		kifu[kifu.length] = moveString;
	}

	if(moveString){
		if(moveString.length === 2){
			lastMove.x = parseInt(moveString.charAt(0), 36);
			lastMove.y = parseInt(moveString.charAt(1), 36);
			lastMove.exists = true;
		}
		else{
			lastMove.exists = false;
		}
	}
	else{
		lastMove.exists = false;
	}
	if(lastMove.exists){
		var opponent = (turn % 2) + 1;
		var player = 3 - opponent;

		var y = lastMove.y;
		var x = lastMove.x;
		dotsData[y][x] = player;

        stonePlacement.play();

        var int;
        if(player === 1)
        	int = 1;
        else
        	int = -1;
        if(y % 2 === 0){
			hexValuer((y-2) / 2, x - 2, int, hexsData);
			hexValuer((y-2) / 2, x, int, hexsData);
			hexValuer(y / 2, x - 1, int, hexsData);		      					
	    }
	    else{
	    	hexValuer((y-3) / 2, x - 1, int, hexsData);
			hexValuer((y-1) / 2, x - 2, int, hexsData);
			hexValuer((y-1) / 2, x, int, hexsData);
	    }

        if(y%2 === 0){
	        opponentHasLibs(y-1, x, opponent, int, dotsData, hexsData);
	        opponentHasLibs(y+1, x-1, opponent, int, dotsData, hexsData);
	        opponentHasLibs(y+1, x+1, opponent, int, dotsData, hexsData);
	    }
	    else{
	        opponentHasLibs(y-1, x-1, opponent, int, dotsData, hexsData);
	        opponentHasLibs(y-1, x+1, opponent, int, dotsData, hexsData);
	      	opponentHasLibs(y+1, x, opponent, int, dotsData, hexsData);
	    }
	}
	else{
		if(turn > 0){
			passSound.play();
		}	
	}        

};

export const count = function(hexsData){
	var p1Points = 0;
    var p2Points = 0;
    var i, j;


  	for(i = 0; i < hexs.length; i++){
    	for(j = 0; j < hexs[0].length; j++){
      		if(hexs[i][j] === 0){
        		if(hexsData[i][j] > 0){
          			p1Points ++;
        		}		
        		else if(hexsData[i][j] < 0){
          			p2Points ++;
        		}
      		
    		}
  		}
  	}
  	return p1Points - p2Points - 1.5;
};