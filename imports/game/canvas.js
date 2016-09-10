import './canvas.html';
import { Games } from '../../imports/collections/games.js';
//import { Test } from '../../imports/collections/games.js';
import { ReactiveVar } from 'meteor/reactive-var';

import { blues, reds, blueimg, redimg, blackimg } from './game.js';


function decimalToHex(x, y) {
    x = x.toString(16);
    y = y.toString(16);
    var hex = "#00" + "00".substr(0, 2 - x.length) + x + "00".substr(0, 2 - y.length) + y;
    return hex;
};

Dot = function (xCntr, yCntr) {
    this.xCntr = xCntr; // x center of the dot
    this.yCntr = yCntr; // y center of the dot
};

findPlayer = function(){
	if(Games.findOne({gNum: Number(FlowRouter.getParam('num')), p1: Meteor.userId()})){
		return 1;
	}
	if(Games.findOne({gNum: Number(FlowRouter.getParam('num')), p2: Meteor.userId()})){
		return 2;
	}
	else
		return 0;
};

Hexagon = function (xCntr, yCntr) {
    this.xCntr = xCntr; // hex x center
    this.yCntr = yCntr; // jex y center
    this.value = 0;
};


Template.Canvas.onDestroyed(function(){
	$(window).off('resize');
});
        
Template.Canvas.onCreated(function(){

	if($(window).width() < 545 || $(window).height() < 545){
		this.zoomFirst = true;
	}
	else{
		this.zoomFirst = false;
	}

	this.isZoomed = false;
	this.imageSave;
	this.dataSave;
	this.blues = blues;
	this.reds = reds;
	this.redimg = redimg;
	this.blueimg = blueimg;
	this.blackimg = blackimg;
	this.gameNumber = Number(FlowRouter.getParam('num'));
	this.game = Games.findOne({gNum: this.gameNumber});
	this.dotsData = this.game.dotsData;
	this.gameId = this.game._id;
	this.player = findPlayer();
	this.previousMove = false;
	if(!this.game.result){
		Session.set('isGameFinished', false);
	}
	else if(!Session.get('isGameFinished')){
		Session.set('isGameFinished', true);
	}


	$(window).resize(()=> {

		if($(window).width() < 545 || $(window).height() < 545){
			this.zoomFirst = true;
		}
		else{
			this.zoomFirst = false;
		}
    	this.divWidth = document.getElementById('canvasHolder').clientWidth;
		this.divHeight = document.getElementById('canvasHolder').clientHeight - 52;
    	if(this.divHeight * 11 / 10 < this.divWidth){
			this.canvasXAdjuster = this.divHeight * 11 / 10;
			this.canvasYAdjuster = this.divHeight;
			this.coAdjuster = 800 / this.divHeight;
		}
		else{
			this.canvasXAdjuster = this.divWidth;
			this.canvasYAdjuster = this.divWidth * 10 / 11;
			this.coAdjuster = 880 / this.divWidth;
		}
		this.canvas.style.height = this.canvasYAdjuster.toString() + "px";
	    this.canvas.style.width = this.canvasXAdjuster.toString() + "px";
	    this.maskCanvas.style.height = this.canvasYAdjuster.toString() + "px";
	    this.maskCanvas.style.width = this.canvasXAdjuster.toString() + "px";
  	});


	this.opponentHasLibs = (o, p, playah, int)=>{
	  	if(this.dotsData[o] && this.dotsData[o][p] && this.dotsData[o][p] === playah){

			var libsCheckArray = new Array(game.xLength);
	  		for(i=0; i < this.dots.length; i++){
	    		libsCheckArray[i] = new Array();
	  		}
	  		if(!this.libsCheck(o, p, playah, libsCheckArray, this.dotsData)){
	  			this.stoneRemover(o, p, playah, int);
	  		}	      
	    }
	}

	this.stoneRemover = (x, y, playah, int)=>{
	  if(this.dotsData[x] && this.dotsData[x][y] === playah){
	    this.dotsData[x][y] = 0;
	    this.ctx.beginPath();
        this.ctx.arc(this.dotsPaint[x][y].xCntr, this.dotsPaint[x][y].yCntr, this.radius, 0, 2*Math.PI, false);
        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = this.line_color;
        this.ctx.fillStyle = this.bg_color;
        this.ctx.stroke();
        this.ctx.fill();
        if(x % 2 === 0){
			this.hexPainter((x-2) / 2, y - 2, int);
			this.hexPainter((x-2) / 2, y, int);
			this.hexPainter(x / 2, y - 1, int);		      					
	    }
	    else{
	    	this.hexPainter((x-3) / 2, y - 1, int);
			this.hexPainter((x-1) / 2, y - 2, int);
			this.hexPainter((x-1) / 2, y, int);
	    }
	    this.ctx.globalAlpha = 1;

	    if(x%2 === 0){
	      this.stoneRemover(x-1, y, playah, int);
	      this.stoneRemover(x+1, y-1, playah, int);
	      this.stoneRemover(x+1, y+1, playah, int);
	  	}
	    else{
	      this.stoneRemover(x-1, y-1, playah, int);
	      this.stoneRemover(x-1, y+1, playah, int);
	      this.stoneRemover(x+1, y, playah, int);
	    }
	  }
	}



	this.hasLibs = (o, p, playah, game)=>{
	  var libsCheckArray = new Array(this.dots.length);
	  for(i=0; i < this.dots.length; i++){
	    libsCheckArray[i] = new Array();
	  }
	  var dotsData = game.dotsData;
	  return this.libsCheck(o, p, playah, libsCheckArray, dotsData);
	}

	this.libsCheck = (x, y, playah, libsCheckArray, dotsData)=>{
	  libsCheckArray[x][y] = true;
	  if(x%2 === 0)
	    return (this.stoneCheck(x-1, y, playah, libsCheckArray, dotsData) || this.stoneCheck(x+1, y-1, playah, libsCheckArray, dotsData) || this.stoneCheck(x+1, y+1, playah, libsCheckArray, dotsData));     
	  else
	    return (this.stoneCheck(x-1, y-1, playah, libsCheckArray, dotsData) || this.stoneCheck(x-1, y+1, playah, libsCheckArray, dotsData) || this.stoneCheck(x+1, y, playah, libsCheckArray, dotsData));
	}

	this.stoneCheck = (i, j, playah, libsCheckArray, dotsData)=>{
	  if(dotsData[i] && dotsData[i][j] !== undefined){
	    if(!libsCheckArray[i][j] && dotsData[i][j] === 0){
	      return true;
	    }
	    else if(!libsCheckArray[i][j] && dotsData[i][j] === playah){
	      return this.libsCheck(i, j, playah, libsCheckArray, dotsData);
	    }
	    else
	      return false;           
	  }
	}
	

	this.hexPainter = (x, y, tempInt)=>{
		if(this.hexsPaint[x] && this.hexsPaint[x][y]){
			this.hexsPaint[x][y].value += tempInt;
			var hex = this.hexsPaint[x][y];
			console.log(x + " " + y + " " + hex.value);
			if(hex.value > 0){
				this.ctx.globalAlpha = 1;
				this.ctx.drawImage(this.blackimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
				this.ctx.globalAlpha = 0.4;
				this.ctx.drawImage(this.blueimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			}
			else if(hex.value < 0){
				this.ctx.globalAlpha = 1;
				this.ctx.drawImage(this.blackimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
				this.ctx.globalAlpha = 0.4;
				this.ctx.drawImage(this.redimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			}
			else{
				this.ctx.globalAlpha = 1;
				this.ctx.drawImage(this.blackimg, hex.xCntr - this.subx + Math.floor(this.subx / 22), hex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			}
		}
	};

	this.makeTurn = ()=>{
		if(this.previousMove){
			var o = this.previousMove.x;
			var p = this.previousMove.y;
			var tempOwner = this.dotsData[o][p];
			var xCntr = this.dotsPaint[o][p].xCntr;
			var yCntr = this.dotsPaint[o][p].yCntr;
			if(tempOwner == 1){
				this.ctx.drawImage(this.blues, xCntr - this.radius, yCntr - this.radius, this.radius * 2, this.radius * 2);
			}

			else if(tempOwner == 2){
				this.ctx.drawImage(this.reds, xCntr - this.radius, yCntr - this.radius, this.radius * 2, this.radius * 2);
			}
			else{
				this.ctx.beginPath();
	            this.ctx.arc(xCntr, yCntr, this.radius, 0, 2*Math.PI, false);
	            this.ctx.lineWidth = 6;
	            this.ctx.strokeStyle = this.line_color;
	            this.ctx.fillStyle = this.bg_color;
	            this.ctx.stroke();
	            this.ctx.fill();
			}
		}
		if(this.lastMove){
			var opponent = (this.turn % 2) + 1;
			var player = 3 - opponent;

			if(player === 1){
				var image1 = this.blues;
				var image2 = this.reds;
			}
			else{
				var image1 = this.reds;
				var image2 = this.blues;
			}
			var x = this.lastMove.x;
			var y = this.lastMove.y;

			this.dotsData[x][y] = player;
			this.previousMove = this.lastMove;

			this.ctx.drawImage(image1, this.dotsPaint[x][y].xCntr - this.radius, this.dotsPaint[x][y].yCntr - this.radius, this.radius * 2, this.radius * 2);
			this.ctx.beginPath();
	        this.ctx.arc(this.dotsPaint[x][y].xCntr, this.dotsPaint[x][y].yCntr, this.radius / 2, 0, 2*Math.PI, false);
	        this.ctx.lineWidth = 6;
	        this.ctx.strokeStyle = this.line_color;
	        this.ctx.fillStyle = this.line_color;
	        this.ctx.fill();

	        if(player === 1)
	        	var int = 1;
	        else
	        	var int = -1;

	        if(x % 2 === 0){
				this.hexPainter((x-2) / 2, y - 2, int);
				this.hexPainter((x-2) / 2, y, int);
				this.hexPainter(x / 2, y - 1, int);		      					
		    }
		    else{
		    	this.hexPainter((x-3) / 2, y - 1, int);
				this.hexPainter((x-1) / 2, y - 2, int);
				this.hexPainter((x-1) / 2, y, int);
		    }
		    this.ctx.globalAlpha = 1;


	        if(x%2 === 0){
		        this.opponentHasLibs(x-1, y, opponent, int);
		        this.opponentHasLibs(x+1, y-1, opponent, int);
		        this.opponentHasLibs(x+1, y+1, opponent, int);
		    }
		    else{
		        this.opponentHasLibs(x-1, y-1, opponent, int);
		        this.opponentHasLibs(x-1, y+1, opponent, int);
		      	this.opponentHasLibs(x+1, y, opponent, int);
		    }
		}
		else{
			this.previousMove = false;
		}        

	}

	this.dotPainter = ()=>{
		console.log((new Date).getTime());

		for(i = 0; i < this.dots.length; i++){
			for(j = 0; j < this.dots[0].length; j++){
				if(this.dotsData[i][j]){
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
      					this.hexPainter((i-2) / 2, j - 2, int);
      					this.hexPainter((i-2) / 2, j, int);
      					this.hexPainter(i / 2, j - 1, int);		      					
      			    }
      			    else{
      			    	this.hexPainter((i-3) / 2, j - 1, int);
      					this.hexPainter((i-1) / 2, j - 2, int);
      					this.hexPainter((i-1) / 2, j, int);
      			    }
      			    this.ctx.globalAlpha = 1;
	      			}
      			}
  			}
		}
		if(this.lastMove){
			this.previousMove = this.lastMove;
			var x = this.lastMove.x;
			var y = this.lastMove.y;
			this.ctx.beginPath();
	        this.ctx.arc(this.dotsPaint[x][y].xCntr, this.dotsPaint[x][y].yCntr, this.radius / 2, 0, 2*Math.PI, false);
	        this.ctx.lineWidth = 6;
	        this.ctx.strokeStyle = this.line_color;
	        this.ctx.fillStyle = this.line_color;
	        this.ctx.fill();
    	}
		console.log((new Date).getTime());
	}

	
});

Template.Canvas.onRendered(function() {

	this.radius = 15;
	this.subx = 44;
	this.suby = 25;
	this.bg_color = "black";
	this.line_color = "white";

    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.maskCanvas = document.getElementById("subCanvas");
    this.maskCanvas.style.display = "none";
    this.pixelContext = this.maskCanvas.getContext("2d");

    this.dotsPaint = new Array();
    this.hexsPaint = new Array();


    this.ctx.fillStyle = "this.bg_color";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

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
            this.hexsPaint[i][j] = new Hexagon(x, y);
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
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.radius, 0, 2*Math.PI, false);
            this.ctx.lineWidth = 6;
            this.ctx.strokeStyle = this.line_color;
            this.ctx.fillStyle = this.bg_color;
            this.ctx.stroke();
            this.ctx.fill();
            this.dotsPaint[i][j] = new Dot(x, y);
            // creates mask
            this.pixelContext.beginPath();
            this.pixelContext.arc(x, y, this.radius*1.5, 0, 2*Math.PI, false);
            this.pixelContext.lineWidth = 6;
            this.pixelContext.strokeStyle = this.line_color;
            this.pixelContext.fillStyle = decimalToHex(i+1, j+1);
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

    this.divWidth = document.getElementById('canvasHolder').clientWidth;
	this.divHeight = document.getElementById('canvasHolder').clientHeight - 52;
	console.log(this.divHeight);
	if(this.divHeight * 11 / 10 < this.divWidth){
		this.canvasXAdjuster = this.divHeight * 11 / 10;
		this.canvasYAdjuster = this.divHeight;
		this.coAdjuster = 800 / this.divHeight;
	}
	else{
		this.canvasXAdjuster = this.divWidth;
		this.canvasYAdjuster = this.divWidth * 10 / 11;
		this.coAdjuster = 880 / this.divWidth;
	}
    this.canvas.style.height = this.canvasYAdjuster.toString() + "px";
    this.canvas.style.width = this.canvasXAdjuster.toString() + "px";
    this.maskCanvas.style.height = this.canvasYAdjuster.toString() + "px";
    this.maskCanvas.style.width = this.canvasXAdjuster.toString() + "px";
  	this.game = Games.findOne(this.gameId);
  	this.turn = this.game.turn;

  	/*this.testObserver = Test.find().observe({

		added: (doc)=>{
			console.log(doc);
			console.log((new Date).getTime());
		}

  	});*/

  	this.gameObserver = Games.find(this.gameId, {
    fields: {
        "turn": 1,
        "result": 1,
        "dotsData": 1,
        "lastMove": 1
    }}).observe({

		added: (doc)=>{
			
			this.dotsData = doc.dotsData
			this.turn = doc.turn;
			this.lastMove = doc.lastMove;
			this.dotPainter();

			if(this.game.result && Session.get('isGameFinished') === false){
				Session.set('isGameFinished', true);
			}
		},

		changed: (doc)=>{
			console.log((new Date).getTime());
			this.game = doc;
			this.turn = doc.turn;
			this.lastMove = doc.lastMove;
			this.makeTurn();

			if(this.game.result && Session.get('isGameFinished') === false){
				Session.set('isGameFinished', true);
			}
		},
	});

	/*$( "#mainCanvas" ).mousemove(function( event ) {
		console.log(event.offsetX);
	});*/
});


Template.Canvas.events({
	'click'(event, instance) {

		console.log((new Date).getTime());
		if(instance.player !== 0 && instance.game.result === false){
			if((instance.player === 1 && instance.turn % 2 === 0) || (instance.player === 2 && instance.turn % 2 !== 0) ){




				if(instance.zoomFirst && !instance.isZoomed){
					zoomX = instance.coAdjuster * event.offsetX;
					zoomY = instance.coAdjuster * event.offsetY;

					if(zoomX - 220 < 0){
						zoomX = 0;
					}
					else if(zoomX + 220 > 880){
						zoomX = 440
					}
					else{
						zoomX -= 220
					}

					if(zoomY - 200 < 0){
						zoomY = 0;
					}
					else if(zoomY + 200 > 800){
						zoomY = 400
					}
					else{
						zoomY -= 200
					}

					instance.imageSave = instance.ctx.getImageData(0, 0, 880, 800);
					instance.dataSave = instance.pixelContext.getImageData(0, 0, 880, 800);

					imageToZoom = instance.ctx.getImageData(zoomX, zoomY, 440, 400);
					dataToZoom = instance.pixelContext.getImageData(zoomX, zoomY, 440, 400);

					var tempCanvas = $("<canvas>")
					    .attr("width", imageToZoom.width)
					    .attr("height", imageToZoom.height)[0];

					tempCanvas.getContext("2d").putImageData(imageToZoom, 0, 0);
					instance.ctx.scale(2, 2);
					instance.ctx.drawImage(tempCanvas, 0, 0);

					tempCanvas.getContext("2d").putImageData(dataToZoom, 0, 0);
					instance.pixelContext.clearRect(0, 0, 880, 800);
					instance.pixelContext.scale(2, 2);
					instance.pixelContext.drawImage(tempCanvas, 0, 0);

					instance.isZoomed = true;
					instance.ctx.scale(0.5, 0.5);
					instance.pixelContext.scale(0.5, 0.5);
					return
				}
				


				var imageData = instance.pixelContext.getImageData(instance.coAdjuster * event.offsetX, instance.coAdjuster * event.offsetY, 1, 1).data;
			    var k = imageData[1] -1;
				var m = imageData[2] -1;
			    if(k > 0){ 
					if(instance.dotsData[k][m] === 0 && instance.hasLibs(k, m, instance.player, instance.game)){
		    	
				        tempNum = Number(FlowRouter.getParam('num'));
				        if(instance.isZoomed){
					        instance.ctx.putImageData(instance.imageSave, 0, 0);
					        instance.pixelContext.clearRect(0, 0, 880, 800);
					        instance.pixelContext.putImageData(instance.dataSave, 0, 0);
					        instance.isZoomed = false;
				    	}

				        Meteor.call('games.makeTurn', k, m, instance.gameId);
				        console.log((new Date).getTime());
				        return;
				    }  
				}
				if(instance.isZoomed){
			        instance.ctx.putImageData(instance.imageSave, 0, 0);
			        instance.pixelContext.clearRect(0, 0, 880, 800);
			        instance.pixelContext.putImageData(instance.dataSave, 0, 0);
			        instance.isZoomed = false;
		    	}
		    }
		}
	}
});