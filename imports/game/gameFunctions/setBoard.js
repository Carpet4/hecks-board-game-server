import { hexs, dots, hasLibs, opponentHasLibs, hexValuer} from './logics.js';

export const setBoard = (location, variation, hexsData, dotsData, kifu, lastMove)=>{
	location = Number(location);
	if(Number.isInteger(location)){
		var turn = 0;
		var dotsArray = new Array(dots.length);
		var i, j;
		for(i=0; i<dots.length; i++){
			dotsArray[i] = [];
			for(j=0; j<dots[0].length; j++){
				if(dots[i][j] === 0){
					dotsArray[i][j] = 0;
				}
			}
		}
		var hexsArray = new Array(hexs.length);
		for(i=0; i<hexs.length; i++){
			hexsArray[i] = [];
			for(j=0; j<hexs[0].length; j++){
				if(hexs[i][j] === 0){
					hexsArray[i][j] = 0;
				}
			}
		}
		var moveString;
		if(!variation || variation[0] >= location){
			for(i=0; i<location; i++){
				if(kifu[i]){
					turn++;
					sbMakeTurn(kifu[i], dotsArray, hexsArray, turn);
				}
			}
			moveString = kifu[location-1];
		}
		else{
			for(i=0; i<variation[0]; i++){
				if(kifu[i]){
					turn++;
					sbMakeTurn(kifu[i], dotsArray, hexsArray, turn);
				}
			}

			for(i=1; i < location + 1 - variation[0]; i++){
				turn++;
				sbMakeTurn(variation[i], dotsArray, hexsArray, turn);
			}
			moveString = variation[location - variation[0]];
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
		return [dotsArray, hexsArray];
	}
};


var sbMakeTurn = (moveString, dotsArray, hexsArray, turn)=>{
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
			if(hasLibs(y, x, player, dotsArray)){
				dotsArray[y][x] = player;

		        var int;
		        if(player === 1)
		        	int = 1;
		        else
		        	int = -1;

		        if(y % 2 === 0){
					hexValuer((y-2) / 2, x - 2, int, hexsArray);
					hexValuer((y-2) / 2, x, int, hexsArray);
					hexValuer(y / 2, x - 1, int, hexsArray);		      					
			    }
			    else{
			    	hexValuer((y-3) / 2, x - 1, int, hexsArray);
					hexValuer((y-1) / 2, x - 2, int, hexsArray);
					hexValuer((y-1) / 2, x, int, hexsArray);
			    }

		        if(y%2 === 0){
			        opponentHasLibs(y-1, x, opponent, int, dotsArray, hexsArray);
			        opponentHasLibs(y+1, x-1, opponent, int, dotsArray, hexsArray);
			        opponentHasLibs(y+1, x+1, opponent, int, dotsArray, hexsArray);
			    }
			    else{
			        opponentHasLibs(y-1, x-1, opponent, int, dotsArray, hexsArray);
			        opponentHasLibs(y-1, x+1, opponent, int, dotsArray, hexsArray);
			      	opponentHasLibs(y+1, x, opponent, int, dotsArray, hexsArray);
			    }
			}
		}		
	}       
};