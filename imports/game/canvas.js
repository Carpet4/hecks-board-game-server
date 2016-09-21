import './canvas.html';
import { Games } from '../../imports/collections/games.js';
//import { Test } from '../../imports/collections/games.js';
import { ReactiveVar } from 'meteor/reactive-var';

import { blues, reds, blueimg, redimg, blackimg, stonePlacement, passSound } from './game.js';







//export let variation = [];




Template.Canvas.onDestroyed(function(){
	$(window).off('resize');
});
        
Template.Canvas.onCreated(function(){
	 Session.set('globalVar', false);

	this.sbOppoHasLibs = (y, x, playah, dotsArray)=>{
	  	if(dotsArray[y] && dotsArray[y][x] && dotsArray[y][x] === playah){

			var libsCheckArray = new Array(this.dots.length);
	  		for(i=0; i < this.dots.length; i++){
	    		libsCheckArray[i] = new Array();
	  		}
	  		if(!this.libsCheck(y, x, playah, libsCheckArray, dotsArray)){
	  			this.sbStoneRemover(y, x, playah, dotsArray);
	  		}	      
	    }
	}

	this.sbStoneRemover = (y, x, playah, dotsArray, gVar)=>{
	  if(dotsArray[y] && dotsArray[y][x] === playah){
	    dotsArray[y][x] = 0;

	    if(y%2 === 0){
	      this.sbStoneRemover(y-1, x, playah, dotsArray);
	      this.sbStoneRemover(y+1, x-1, playah, dotsArray);
	      this.sbStoneRemover(y+1, x+1, playah, dotsArray);
	  	}
	    else{
	      this.sbStoneRemover(y-1, x-1, playah, dotsArray);
	      this.sbStoneRemover(y-1, x+1, playah, dotsArray);
	      this.sbStoneRemover(y+1, x, playah, dotsArray);
	    }
	  }
	}


	this.setBoard = (location, variation)=>{
		console.log((new Date).getTime());
		location = Number(location);
		if(Number.isInteger(location)){
			if(this.game.result !== false){
				if(!variation){
					if(location + 1 > this.kifu.length){
						location = this.kifu.length;
						if(document.getElementById('moveNumber')){
							document.getElementById('moveNumber').value = location;
						}
					}
				}
				else{
					if(location + 2 > variation[0] + variation.length){
						location = variation[0] + variation.length - 1;
						if(document.getElementById('moveNumber')){
							document.getElementById('moveNumber').value = location;
						}
					}
				}
			}
			this.turn = 0;
			var dotsArray = new Array(this.dots.length);
			for(var i=0; i<this.dots.length; i++){
				dotsArray[i] = new Array();
				for(var j=0; j<this.dots[0].length; j++){
					if(this.dots[i][j] === 0){
						dotsArray[i][j] = 0;
					}
				}
			}
			if(!variation || variation[0] >= location){
				for(var i=0; i<location; i++){
					if(this.kifu[i]){
						this.sbMakeTurn(this.kifu[i], dotsArray);
					}
				}
				var moveString = this.kifu[location-1];
			}
			else{
				for(var i=0; i<variation[0]; i++){
					if(this.kifu[i]){
						this.sbMakeTurn(this.kifu[i], dotsArray);
					}
				}

				for(var i=1; i < location + 1 - variation[0]; i++){
					this.sbMakeTurn(variation[i], dotsArray)
				}
				var moveString = variation[location - variation[0]];
			}

			if(moveString){
				if(moveString.length === 2){
					this.lastMove = {};
					this.lastMove.x = parseInt(moveString.charAt(0), 36);
					this.lastMove.y = parseInt(moveString.charAt(1), 36);
				}
				else{
					this.lastMove = false;
				}
			}
			else{
				this.lastMove = false;
			}
			this.dotsData = dotsArray;
			this.boardPainter();
		}
		console.log((new Date).getTime());
	}


	this.sbMakeTurn = (moveString, dotsArray, turn)=>{
		this.turn++;
		if(moveString){
			var lastMove;
			if(moveString.length === 2){
				lastMove = true;
			}
			else{
				lastMove = false;
			}
		}
		else{
			lastMove = false;
		}
		if(lastMove){
			var opponent = (this.turn % 2) + 1;
			var player = 3 - opponent;
			var x = parseInt(moveString.charAt(0), 36);
			var y = parseInt(moveString.charAt(1), 36);
			if(this.dots[y] && this.dots[y][x] === 0){
				if(this.hasLibs(y, x, player, dotsArray)){
					dotsArray[y][x] = player;

			        if(y%2 === 0){
				        this.sbOppoHasLibs(y-1, x, opponent, dotsArray);
				        this.sbOppoHasLibs(y+1, x-1, opponent, dotsArray);
				        this.sbOppoHasLibs(y+1, x+1, opponent, dotsArray);
				    }
				    else{
				        this.sbOppoHasLibs(y-1, x-1, opponent, dotsArray);
				        this.sbOppoHasLibs(y-1, x+1, opponent, dotsArray);
				      	this.sbOppoHasLibs(y+1, x, opponent, dotsArray);
				    }
				}
			}		
		}       
	}
	//XXXXX

	this.decimalToHex = function(y, x) {
	    y = y.toString(16);
	    x = x.toString(16);
	    var hex = "#00" + "00".substr(0, 2 - y.length) + y + "00".substr(0, 2 - x.length) + x;
	    return hex;
	};

	this.findPlayer = ()=>{
	if(Games.findOne({_id: this.gameId, p1: Meteor.userId()})){
		return 1;
	}
	if(Games.findOne({_id: this.gameId, p2: Meteor.userId()})){
		return 2;
	}
	else
		return 0;
	};

	this.Hexagon = function (xCntr, yCntr) {
	    this.xCntr = xCntr; // hex x center
	    this.yCntr = yCntr; // jex y center
	    this.value = 0;
	};

	this.Dot = function (xCntr, yCntr) {
	    this.xCntr = xCntr; // x center of the dot
	    this.yCntr = yCntr; // y center of the dot
	};


	if($(window).width() < 545 || $(window).height() < 545){
		this.zoomFirst = true;
	}
	else{
		this.zoomFirst = false;
	}

	Session.set('myVar', false);
	this.isZoomed = false;
	this.lastK = -1;
	this.lastM = -1;
	this.imageSave;
	this.imageSave2;
	this.dataSave;
	this.dotImgs = new Array(3);
	this.blues = blues;
	this.reds = reds;
	this.redimg = redimg;
	this.blueimg = blueimg;
	this.blackimg = blackimg;
	this.dotImgs[1] = this.blues;
	this.dotImgs[2] = this.reds;
	this.stonePlacement = stonePlacement;
	this.passSound = passSound;
	this.gameId = FlowRouter.getParam('id');
	this.game = Games.findOne(this.gameId);
	this.dotsData = this.game.dotsData;
	this.player = this.findPlayer();
	this.previousMove = false;
	this.canvasW = 880;
	this.canvasH = 800;
	this.currentVariation = false;
	this.lastGVar = false;
	if(!this.game.result){
		Session.set('isGameFinished', false);
	}
	else if(!Session.get('isGameFinished')){
		Session.set('isGameFinished', true);

	}

	this.canvasResizer = ()=>{
		if($(window).width() < 545 || $(window).height() < 545){
			this.zoomFirst = true;
		}
		else{
			this.zoomFirst = false;
		}
		var divWidth = document.getElementById('canvasCol').clientWidth;
		var winHeight = $(window).height() - 56;

		var canvasHolder = document.getElementById('canvasHolder');

		if(window.getComputedStyle(canvasHolder).getPropertyValue('z-index') == 1 && divWidth < winHeight * 11 / 10){
			
			var height = divWidth * 10 / 11;
			document.getElementById('canvasHolder').style.height = height.toString() + "px";
			document.getElementById('canvasHolder').style.width = divWidth.toString() + "px";
			this.canvas.style.height = height.toString() + "px";
		    this.canvas.style.width = divWidth.toString() + "px";
		    this.canvas2.style.height = height.toString() + "px";
		    this.canvas2.style.width = divWidth.toString() + "px";
		    this.maskCanvas.style.height = height.toString() + "px";
		    this.maskCanvas.style.width = divWidth.toString() + "px";
		    this.coAdjuster = this.canvasW / divWidth;
		}

    	if(winHeight * 11 / 10 < divWidth){
			this.canvasXAdjuster = winHeight * 11 / 10;
			this.canvasYAdjuster = winHeight;
			this.coAdjuster = this.canvasH / winHeight;
		}
		else{
			this.canvasXAdjuster = divWidth;
			this.canvasYAdjuster = divWidth * 10 / 11;
			this.coAdjuster = this.canvasW / divWidth;
		}

		document.getElementById('canvasHolder').style.height = this.canvasYAdjuster.toString() + "px";
		document.getElementById('canvasHolder').style.width = this.canvasXAdjuster.toString() + "px";
		this.canvas.style.height = this.canvasYAdjuster.toString() + "px";
	    this.canvas.style.width = this.canvasXAdjuster.toString() + "px";
	    this.canvas2.style.height = this.canvasYAdjuster.toString() + "px";
	    this.canvas2.style.width = this.canvasXAdjuster.toString() + "px";
	    this.maskCanvas.style.height = this.canvasYAdjuster.toString() + "px";
	    this.maskCanvas.style.width = this.canvasXAdjuster.toString() + "px";

	}


	$(window).resize(()=> {
		this.canvasResizer();
  	});


	this.opponentHasLibs = (y, x, playah, int)=>{
	  	if(this.dotsData[y] && this.dotsData[y][x] && this.dotsData[y][x] === playah){

			var libsCheckArray = new Array(this.dots.length);
	  		for(i=0; i < this.dots.length; i++){
	    		libsCheckArray[i] = new Array();
	  		}
	  		if(!this.libsCheck(y, x, playah, libsCheckArray, this.dotsData)){
	  			this.stoneRemover(y, x, playah, int);
	  		}	      
	    }
	}

	this.stoneRemover = (y, x, playah, int)=>{
	  if(this.dotsData[y] && this.dotsData[y][x] === playah){
	    this.dotsData[y][x] = 0;
	    this.drawArc(this.dotsPaint[y][x].xCntr, this.dotsPaint[y][x].yCntr);
        if(y % 2 === 0){
			this.hexMakeTurn((y-2) / 2, x - 2, int);
			this.hexMakeTurn((y-2) / 2, x, int);
			this.hexMakeTurn(y / 2, x - 1, int);		      					
	    }
	    else{
	    	this.hexMakeTurn((y-3) / 2, x - 1, int);
			this.hexMakeTurn((y-1) / 2, x - 2, int);
			this.hexMakeTurn((y-1) / 2, x, int);
	    }
	    this.ctx2.globalAlpha = 1;

	    if(y%2 === 0){
	      this.stoneRemover(y-1, x, playah, int);
	      this.stoneRemover(y+1, x-1, playah, int);
	      this.stoneRemover(y+1, x+1, playah, int);
	  	}
	    else{
	      this.stoneRemover(y-1, x-1, playah, int);
	      this.stoneRemover(y-1, x+1, playah, int);
	      this.stoneRemover(y+1, x, playah, int);
	    }
	  }
	}



	this.hasLibs = (y, x, playah, dotsData)=>{
	  var libsCheckArray = new Array(this.dots.length);
	  for(i=0; i < this.dots.length; i++){
	    libsCheckArray[i] = new Array();
	  }
	  return this.libsCheck(y, x, playah, libsCheckArray, dotsData);
	}

	this.libsCheck = (y, x, playah, libsCheckArray, dotsData)=>{
	  libsCheckArray[y][x] = true;
	  if(y%2 === 0)
	    return (this.stoneCheck(y-1, x, playah, libsCheckArray, dotsData) || this.stoneCheck(y+1, x-1, playah, libsCheckArray, dotsData) || this.stoneCheck(y+1, x+1, playah, libsCheckArray, dotsData));     
	  else
	    return (this.stoneCheck(y-1, x-1, playah, libsCheckArray, dotsData) || this.stoneCheck(y-1, x+1, playah, libsCheckArray, dotsData) || this.stoneCheck(y+1, x, playah, libsCheckArray, dotsData));
	}

	this.stoneCheck = (y, x, playah, libsCheckArray, dotsData)=>{
	  if(dotsData[y] && dotsData[y][x] !== undefined){
	    if(!libsCheckArray[y][x] && dotsData[y][x] === 0){
	      return true;
	    }
	    else if(!libsCheckArray[y][x] && dotsData[y][x] === playah){
	      return this.libsCheck(y, x, playah, libsCheckArray, dotsData);
	    }
	    else
	      return false;           
	  }
	}
	

	

	this.makeTurn = (moveString)=>{
		if(!this.game.result){
			this.kifu[this.kifu.length] = moveString;
		}
		if(this.previousMove){
			var y = this.previousMove.y;
			var x = this.previousMove.x;
			var tempOwner = this.dotsData[y][x];
			var xCntr = this.dotsPaint[y][x].xCntr;
			var yCntr = this.dotsPaint[y][x].yCntr;
			if(tempOwner == 1){
				this.ctx.drawImage(this.blues, xCntr - this.radius, yCntr - this.radius, this.radius * 2, this.radius * 2);
			}

			else if(tempOwner == 2){
				this.ctx.drawImage(this.reds, xCntr - this.radius, yCntr - this.radius, this.radius * 2, this.radius * 2);
			}
			else{
				this.drawArc(xCntr, yCntr);
			}
		}

		if(moveString){
			if(moveString.length === 2){
				this.lastMove = {};
				this.lastMove.x = parseInt(moveString.charAt(0), 36);
				this.lastMove.y = parseInt(moveString.charAt(1), 36);
			}
			else{
				this.lastMove = false;
			}
		}
		else{
			this.lastMove = false;
		}
		if(this.lastMove){
			this.turn++
			var opponent = (this.turn % 2) + 1;
			var player = 3 - opponent;

			if(player === 1){
				var image1 = this.blues;
			}
			else{
				var image1 = this.reds;
			}
			var y = this.lastMove.y;
			var x = this.lastMove.x;
			this.dotsData[y][x] = player;
			this.previousMove = this.lastMove;
			var paintDot = this.dotsPaint[y][x];

			this.ctx.drawImage(image1, paintDot.xCntr - this.radius, paintDot.yCntr - this.radius, this.radius * 2, this.radius * 2);
			this.ctx.beginPath();
	        this.ctx.arc(paintDot.xCntr, paintDot.yCntr, this.radius / 2, 0, 2*Math.PI, false);
	        this.ctx.lineWidth = 3;
	        this.ctx.strokeStyle = this.line_color;
	        this.ctx.fillStyle = this.line_color;
	        this.ctx.fill();

	        this.stonePlacement.play();

	        if(this.lastK > -1){
	        	if(this.dotsData[this.lastK][this.lastM] === 0){
	        		this.drawArc(this.dotsPaint[this.lastK][this.lastM].xCntr, this.dotsPaint[this.lastK][this.lastM].yCntr);
	        	}
	        	this.lastK = -1;
	        	this.lastM = -1;
	        }


	        if(player === 1)
	        	var int = 1;
	        else
	        	var int = -1;

	        if(y % 2 === 0){
				this.hexMakeTurn((y-2) / 2, x - 2, int);
				this.hexMakeTurn((y-2) / 2, x, int);
				this.hexMakeTurn(y / 2, x - 1, int);		      					
		    }
		    else{
		    	this.hexMakeTurn((y-3) / 2, x - 1, int);
				this.hexMakeTurn((y-1) / 2, x - 2, int);
				this.hexMakeTurn((y-1) / 2, x, int);
		    }
		    this.ctx2.globalAlpha = 1;


	        if(y%2 === 0){
		        this.opponentHasLibs(y-1, x, opponent, int);
		        this.opponentHasLibs(y+1, x-1, opponent, int);
		        this.opponentHasLibs(y+1, x+1, opponent, int);
		    }
		    else{
		        this.opponentHasLibs(y-1, x-1, opponent, int);
		        this.opponentHasLibs(y-1, x+1, opponent, int);
		      	this.opponentHasLibs(y+1, x, opponent, int);
		    }
		}
		else{
			this.previousMove = false;
			if(this.turn > 0){
				this.passSound.play();
			}
		}        

	}

	this.hexValuer = (y, x, tempInt)=>{
		if(this.hexsPaint[y] && this.hexsPaint[y][x]){
			this.hexsPaint[y][x].value += tempInt;
		}
	}

	this.hexPainter = (y, x, tempInt)=>{
		var hex = this.hexsPaint[y][x];
		if(hex.value > 0){
			this.ctx2.globalAlpha = 1;
			this.ctx2.drawImage(this.blackimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			this.ctx2.globalAlpha = 0.4;
			this.ctx2.drawImage(this.blueimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
		}
		else if(hex.value < 0){
			this.ctx2.globalAlpha = 1;
			this.ctx2.drawImage(this.blackimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			this.ctx2.globalAlpha = 0.4;
			this.ctx2.drawImage(this.redimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
		}
		else{
			this.ctx2.globalAlpha = 1;
			this.ctx2.drawImage(this.blackimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
		}
	};

	this.hexMakeTurn = (y, x, tempInt)=>{
		if(this.hexsPaint[y] && this.hexsPaint[y][x]){
			this.hexsPaint[y][x].value += tempInt;
			var hex = this.hexsPaint[y][x];
			if(hex.value > 0){
				this.ctx2.globalAlpha = 1;
				this.ctx2.drawImage(this.blackimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
				this.ctx2.globalAlpha = 0.4;
				this.ctx2.drawImage(this.blueimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			}
			else if(hex.value < 0){
				this.ctx2.globalAlpha = 1;
				this.ctx2.drawImage(this.blackimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
				this.ctx2.globalAlpha = 0.4;
				this.ctx2.drawImage(this.redimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			}
			else{
				this.ctx2.globalAlpha = 1;
				this.ctx2.drawImage(this.blackimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			}
		}	
	};

	this.boardPainter = ()=>{
		//resets hexagons
		for(var i=0; i<this.hexs.length; i++){
			for(var j=0; j<this.hexs[0].length; j++){
				if(this.hexsPaint[i][j]){
					this.hexsPaint[i][j].value = 0;
				}
			}
		}

		for(i = 0; i < this.dots.length; i++){
			for(j = 0; j < this.dots[0].length; j++){
				if(this.dotsData[i][j] || this.dotsData[i][j] === 0){

	  				tempOwner = this.dotsData[i][j];//owner of the server dot
	  				if(tempOwner > 0){
		  				if(tempOwner == 1){
		  					this.ctx.drawImage(this.blues, this.dotsPaint[i][j].xCntr - this.radius, this.dotsPaint[i][j].yCntr - this.radius, this.radius * 2, this.radius * 2);
		  					var int = 1;
		  				}
		  				else if(tempOwner == 2){
		  					this.ctx.drawImage(this.reds, this.dotsPaint[i][j].xCntr - this.radius, this.dotsPaint[i][j].yCntr - this.radius, this.radius * 2, this.radius * 2);
		  					var int = -1;
		  				}
		  				

	      				//reactively draws hexagons
	      				if(i % 2 === 0){
	      					this.hexValuer((i-2) / 2, j - 2, int);
	      					this.hexValuer((i-2) / 2, j, int);
	      					this.hexValuer(i / 2, j - 1, int);		      					
	      			    }
	      			    else{
	      			    	this.hexValuer((i-3) / 2, j - 1, int);
	      					this.hexValuer((i-1) / 2, j - 2, int);
	      					this.hexValuer((i-1) / 2, j, int);
	      			    }
	      			    this.ctx2.globalAlpha = 1;
	      			}
	      			else{
	  					this.drawArc(this.dotsPaint[i][j].xCntr, this.dotsPaint[i][j].yCntr);
	  				}
  				}
  			}
		}
		if(this.lastMove){
			this.previousMove = this.lastMove;
			var y = this.lastMove.y;
			var x = this.lastMove.x;
			this.ctx.beginPath();
	        this.ctx.arc(this.dotsPaint[y][x].xCntr, this.dotsPaint[y][x].yCntr, this.radius / 2, 0, 2*Math.PI, false);
	        this.ctx.lineWidth = 3;
	        this.ctx.strokeStyle = this.line_color;
	        this.ctx.fillStyle = this.line_color;
	        this.ctx.fill();
    	}
		for(var i=0; i<this.hexs.length; i++){
			for(var j=0; j<this.hexs[0].length; j++){
				if(this.hexsPaint[i][j]){
					this.hexPainter(i, j);
				}
			}
		}
	}

	
});

Template.Canvas.onRendered(function() {

	this.radius = 20;
	this.subx = 44;
	this.suby = 25;
	this.bg_color = "black";
	this.line_color = "white";

    this.canvas = document.getElementById("canvas1");
    this.ctx = this.canvas.getContext("2d");
    this.canvas2 = document.getElementById("canvas2");
    this.ctx2 = this.canvas2.getContext("2d");
    this.maskCanvas = document.getElementById("subCanvas");
    this.maskCanvas.style.display = "none";
    this.pixelContext = this.maskCanvas.getContext("2d");

    this.dotsPaint = new Array();
    this.hexsPaint = new Array();


    this.ctx2.fillStyle = "this.bg_color";
    this.ctx2.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawArc = (x, y)=>{
    	this.ctx.beginPath();
        this.ctx.arc(x, y, this.radius, 0, 2*Math.PI, false);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = this.line_color;
        this.ctx.fillStyle = this.bg_color;
        this.ctx.stroke();
        this.ctx.fill();
    }

    this.hexs = [
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

    this.dots = [
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

    var i, j;
    var x = this.subx; //istead of 112
    var y = this.suby*2; //instead of 50

    //default boardRenderer.subx is 44, default boardRenderer.suby is 25
    for(i = 0; i < this.hexs.length; i++){
    	this.hexsPaint[i] = new Array();
        for(j = 0; j < this.hexs[0].length; j++){
            x = x + this.subx;
            if(this.hexs[i][j] === 1)
                continue;
            this.ctx.beginPath();
            this.ctx.moveTo(x,y);
            this.ctx.lineTo(x-this.subx,y+this.suby);
            this.ctx.lineTo(x-this.subx,y+this.suby*3);
            this.ctx.lineTo(x,y+this.suby*4);
            this.ctx.lineTo(x+this.subx,y+this.suby*3);
            this.ctx.lineTo(x+this.subx,y+this.suby);
            this.ctx.closePath();
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = this.line_color;
            this.ctx.stroke();
            this.hexsPaint[i][j] = new this.Hexagon(x, y);
        }
        x = this.subx;

        y += this.suby*3;
    }

    var i, j;
    var x = 0;
    var y = this.suby*2; //instead of 50

    for(i = 0; i < this.dots.length; i++){
    	this.dotsPaint[i] = new Array();
        for(j = 0; j < this.dots[0].length; j++) {
            x = x + this.subx;
            if(this.dots[i][j] === 1)
                continue;
            this.drawArc(x, y);
            this.dotsPaint[i][j] = new this.Dot(x, y);
            // creates mask
            this.pixelContext.beginPath();
            this.pixelContext.arc(x, y, this.radius*1.1, 0, 2*Math.PI, false);
            this.pixelContext.lineWidth = 3;
            this.pixelContext.strokeStyle = this.line_color;
            this.pixelContext.fillStyle = this.decimalToHex(i+1, j+1);
            this.pixelContext.fill();
        }
        var x = 0;
        if (i % 2 === 0){
            y += this.suby;
        }
        else{
            y += this.suby * 2;
        }
    }

    this.canvasResizer();

  	this.gameObserver = Games.find(this.gameId, {
    fields: {
        "turn": 1,
        "result": 1,
        "kifu": 1,
        "lastMove": 1
    }}).observe({

		added: (doc)=>{
			
			//this.dotsData = doc.dotsData
			this.turn = doc.turn;
			this.kifu = doc.kifu;
			Session.set('moveNum', this.kifu.length);
			var moveString = doc.lastMove;
			if(moveString){
				if(moveString.length === 2){
					this.lastMove = {};
					this.lastMove.x = parseInt(moveString.charAt(0), 36);
					this.lastMove.y = parseInt(moveString.charAt(1), 36);
				}
				else{
					this.lastMove = false;
				}
			}
			else{
				this.lastMove = false;
			}

			this.boardPainter();

			if(this.game.result && Session.get('isGameFinished') === false){
				Session.set('isGameFinished', true);
			}
		},

		changed: (doc)=>{
			this.game = doc;
			if(!this.game.result){
				this.makeTurn(doc.lastMove);
			}
			else if(Session.get('isGameFinished') === false){
				Session.set('moveNum', this.kifu.length);
				Session.set('isGameFinished', true);
			}
		},
	});

	this.autorun(()=>{
		var num = Session.get('moveNum');
		var gVar = Session.get('globalVar');
		if(num == 0 || (this.currentVariation && num < this.currentVariation[0])){
			this.currentVariation = false;
			Session.set('myVar', false);
			this.lastGVar = false;
			Session.set('globalVar', false);
			gVar = false;
		}
		if(gVar && (!this.lastGVar || gVar.join() !== this.lastGVar.join())){
			this.lastGVar = gVar;
			this.currentVariation = gVar;
			Session.set('myVar', gVar);
			this.escapedVariation = false;
			this.setBoard(gVar[0] + gVar.length - 1, gVar);
		}
		else{
			this.setBoard(num, this.currentVariation);
		} 
	});

	$( "#canvas1" ).mousemove((event)=>{
		if(!this.isZoomed){
			if((this.turn % 2)+1 === this.player || this.game.result !== false){
				var imageData = this.pixelContext.getImageData(this.coAdjuster * event.offsetX, this.coAdjuster * event.offsetY, 1, 1).data;
			    var k = imageData[1] -1;
				var m = imageData[2] -1;
				if((k !== this.lastK || m !== this.lastM) && imageData[3] === 255 || imageData[3] === 0){

					if(this.lastK > -1 && this.lastM > -1 && this.dotsData[this.lastK][this.lastM] === 0){
						this.drawArc(this.dotsPaint[this.lastK][this.lastM].xCntr, this.dotsPaint[this.lastK][this.lastM].yCntr)
			        }

		    		this.lastK = k;
		    		this.lastM = m;
			    	if(k > -1){ 
			    		var player = this.turn%2 + 1;
						if(this.dotsData[k][m] === 0 && this.hasLibs(k, m, player, this.dotsData)){
							this.ctx.drawImage(this.dotImgs[player], this.dotsPaint[k][m].xCntr - this.radius, this.dotsPaint[k][m].yCntr - this.radius, this.radius * 2, this.radius * 2);
					    } 
					} 
				}
			}
		}
		
	});
});


Template.Canvas.events({

	'click'(event, instance) {

		if((instance.player === 1 && instance.turn % 2 === 0) || (instance.player === 2 && instance.turn % 2 !== 0) || instance.game.result !== false){
			if(instance.zoomFirst && !instance.isZoomed){
				if(instance.lastK > -1 && instance.dotsData[instance.lastK][instance.lastM] === 0){
					instance.drawArc(instance.dotsPaint[instance.lastK][instance.lastM].xCntr, instance.dotsPaint[instance.lastK][instance.lastM].yCntr);

		        	instance.lastK = -1;
		        	instance.lastM = -1;
		        }

				zoomX = instance.coAdjuster * event.offsetX;
				zoomY = instance.coAdjuster * event.offsetY;

				if(zoomX - (instance.canvasW/4) < 0){
					zoomX = 0;
				}
				else if(zoomX + (instance.canvasW/4) > instance.canvasW){
					zoomX = (instance.canvasW/2)
				}
				else{
					zoomX -= (instance.canvasW/4)
				}

				if(zoomY - (instance.canvasH/4) < 0){
					zoomY = 0;
				}
				else if(zoomY + (instance.canvasH/4) > instance.canvasH){
					zoomY = (instance.canvasH/2);
				}
				else{
					zoomY -= (instance.canvasH/4)
				}

				instance.imageSave = instance.ctx.getImageData(0, 0, instance.canvasW, instance.canvasH);
				instance.imageSave2 = instance.ctx2.getImageData(0, 0, instance.canvasW, instance.canvasH);
				instance.dataSave = instance.pixelContext.getImageData(0, 0, instance.canvasW, instance.canvasH);

				imageToZoom = instance.ctx.getImageData(zoomX, zoomY, (instance.canvasW/2), (instance.canvasH/2));
				imageToZoom2 = instance.ctx2.getImageData(zoomX, zoomY, (instance.canvasW/2), (instance.canvasH/2));
				dataToZoom = instance.pixelContext.getImageData(zoomX, zoomY, (instance.canvasW/2), (instance.canvasH/2));

				var tempCanvas = $("<canvas>")
				    .attr("width", imageToZoom.width)
				    .attr("height", imageToZoom.height)[0];

				tempCanvas.getContext("2d").putImageData(imageToZoom, 0, 0);
				instance.ctx.clearRect(0, 0, instance.canvasW, instance.canvasH);
				instance.ctx.scale(2, 2);
				instance.ctx.drawImage(tempCanvas, 0, 0);

				tempCanvas.getContext("2d").putImageData(imageToZoom2, 0, 0);
				instance.ctx2.clearRect(0, 0, instance.canvasW, instance.canvasH);
				instance.ctx2.scale(2, 2);
				instance.ctx2.drawImage(tempCanvas, 0, 0);

				tempCanvas.getContext("2d").putImageData(dataToZoom, 0, 0);
				instance.pixelContext.clearRect(0, 0, instance.canvasW, instance.canvasH);
				instance.pixelContext.scale(2, 2);
				instance.pixelContext.drawImage(tempCanvas, 0, 0);

				instance.isZoomed = true;
				instance.ctx.scale(0.5, 0.5);
				instance.ctx2.scale(0.5, 0.5);
				instance.pixelContext.scale(0.5, 0.5);
				return
			}
			


			var imageData = instance.pixelContext.getImageData(instance.coAdjuster * event.offsetX, instance.coAdjuster * event.offsetY, 1, 1).data;
		    var k = imageData[1] -1;
			var m = imageData[2] -1;
		    if(k > -1 && imageData[3] === 255){
		    	var player = instance.turn % 2 + 1; 
				if(instance.dotsData[k][m] === 0 && instance.hasLibs(k, m, player, instance.dotsData)){
	    	
			        if(instance.isZoomed){
			        	instance.ctx.clearRect(0, 0, instance.canvasW, instance.canvasH);
				        instance.ctx.putImageData(instance.imageSave, 0, 0);
				        instance.ctx2.clearRect(0, 0, instance.canvasW, instance.canvasH);
				        instance.ctx2.putImageData(instance.imageSave2, 0, 0);
				        instance.pixelContext.clearRect(0, 0, instance.canvasW, instance.canvasH);
				        instance.pixelContext.putImageData(instance.dataSave, 0, 0);
				        instance.isZoomed = false;
			    	}
			    	if(instance.game.result === false){
			        	Meteor.call('games.makeTurn', k, m, instance.gameId);
			    	}
			    	else{
			    		var moveString = m.toString(36) + k.toString(36);
			    		if(Session.get('myVar')){
			    			var variation = Session.get('myVar');
			    			var placement = instance.turn + 1 - variation[0];
			    			variation[placement] = moveString;
			    			variation.splice(placement+1);
			    		}
			    		else{
			    			var variation = [];
			    			variation.push(Session.get('moveNum'));
			    			variation.push(moveString);
			    		}
			    		instance.currentVariation = variation;
			    		Session.set('myVar', variation);
			    		instance.makeTurn(moveString);			    		
			    	}
			        return;
			    }  
			}
			if(instance.isZoomed){
				instance.ctx.clearRect(0, 0, instance.canvasW, instance.canvasH);
		        instance.ctx.putImageData(instance.imageSave, 0, 0);
		        instance.ctx2.clearRect(0, 0, instance.canvasW, instance.canvasH);
		        instance.ctx2.putImageData(instance.imageSave2, 0, 0);
		        instance.pixelContext.clearRect(0, 0, instance.canvasW, instance.canvasH);
		        instance.pixelContext.putImageData(instance.dataSave, 0, 0);
		        instance.isZoomed = false;
	    	}
	    }
	}
});