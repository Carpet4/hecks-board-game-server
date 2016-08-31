import './canvas.html';
import { Games } from '../../imports/collections/games.js';
//import { Test } from '../../imports/collections/games.js';
import { ReactiveVar } from 'meteor/reactive-var';

import { blues, reds, blueimg, redimg, blackimg } from './game.js';


function decimalToHex(d) {
    var hex = Number(d).toString(16);
    hex = "#000000".substr(0, 7 - hex.length) + hex;
    return hex;
};

Dot = function (fillStyle, xCntr, yCntr) {
    this.xCntr = xCntr; // x center of the dot
    this.yCntr = yCntr; // y center of the dot
    this.mask_fillStyle = fillStyle;
    this.owner = 0;
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
	this.blues = blues;
	this.reds = reds;
	this.redimg = redimg;
	this.blueimg = blueimg;
	this.blackimg = blackimg;
	console.log(this.blackimg);
	this.gameNumber = Number(FlowRouter.getParam('num'));
	this.game = Games.findOne({gNum: this.gameNumber});
	this.gameId = this.game._id;
	this.player = findPlayer();
	this.lastMoveIndex = false;
	this.lastMoveBool = false;
	if(!this.game.result){
		Session.set('isGameFinished', false);
	}
	else if(!Session.get('isGameFinished')){
		Session.set('isGameFinished', true);
	}


	$(window).resize(()=> {
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
	

	this.hexPainter = (x, y)=>{
		if(this.hexsPaint[x] && this.hexsPaint[x][y]){
			this.hexsPaint[x][y].value += tempInt;
			tempHex = this.hexsPaint[x][y];
			if(tempHex.value > 0){
				this.ctx.globalAlpha = 1;
				this.ctx.drawImage(this.blackimg, tempHex.xCntr - this.subx + Math.floor(this.subx / 22), tempHex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
				this.ctx.globalAlpha = 0.5;
				this.ctx.drawImage(this.blueimg, tempHex.xCntr - this.subx + Math.floor(this.subx / 22), tempHex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			}
			else if(tempHex.value < 0){
				this.ctx.globalAlpha = 1;
				this.ctx.drawImage(this.blackimg, tempHex.xCntr - this.subx + Math.floor(this.subx / 22), tempHex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
				this.ctx.globalAlpha = 0.5;
				this.ctx.drawImage(this.redimg, tempHex.xCntr - this.subx + Math.floor(this.subx / 22), tempHex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			}
			else{
				this.ctx.globalAlpha = 1;
				this.ctx.drawImage(this.blackimg, tempHex.xCntr - this.subx + Math.floor(this.subx / 22), tempHex.yCntr + Math.floor(this.suby / 2), this.subx * 2 - 4, this.suby * 3 + 1);
			}
		}
	};

	this.dotPainter = ()=>{
		console.log((new Date).getTime());

		if(this.lastMoveBool && this.lastMoveIndex){
			tempIndex = this.lastMoveIndex;
			tempOwner = this.dotsPaint[tempIndex].owner;
			if(tempOwner == 1){
				this.ctx.drawImage(this.blues, this.dotsPaint[tempIndex].xCntr - this.radius, this.dotsPaint[tempIndex].yCntr - this.radius, this.radius * 2, this.radius * 2);
			}

			else if(tempOwner == 2){
				this.ctx.drawImage(this.reds, this.dotsPaint[tempIndex].xCntr - this.radius, this.dotsPaint[tempIndex].yCntr - this.radius, this.radius * 2, this.radius * 2);
			}
			else{
				this.ctx.beginPath();
	            this.ctx.arc(this.dotsPaint[tempIndex].xCntr, this.dotsPaint[tempIndex].yCntr, this.radius, 0, 2*Math.PI, false);
	            this.ctx.lineWidth = 6;
	            this.ctx.strokeStyle = this.line_color;
	            this.ctx.fillStyle = this.bg_color;
	            this.ctx.stroke();
	            this.ctx.fill();

			}

		}

		for(i = 0; i < this.dots.length; i++){
			for(j = 0; j < this.dots[0].length; j++){
				if(this.game.dotsData[i][j]){
  				tempOwner = this.game.dotsData[i][j].owner;//owner of the server dot
  				tempIndex = this.game.dotsData[i][j].index;//index of the dot
      				if(tempOwner !== this.dotsPaint[tempIndex].owner){
	      				if(tempOwner == 1){
	      					this.ctx.drawImage(this.blues, this.dotsPaint[tempIndex].xCntr - this.radius, this.dotsPaint[tempIndex].yCntr - this.radius, this.radius * 2, this.radius * 2);
	      					if(this.lastMoveBool){
		      					this.ctx.beginPath();
				                this.ctx.arc(this.dotsPaint[tempIndex].xCntr, this.dotsPaint[tempIndex].yCntr, this.radius / 2, 0, 2*Math.PI, false);
				                this.ctx.lineWidth = 6;
				                this.ctx.strokeStyle = this.line_color;
				                this.ctx.fillStyle = this.line_color;
				                this.ctx.fill();
				                this.lastMoveIndex = tempIndex;
			            	}
	      				}
	      				else if(tempOwner == 2){
	      					this.ctx.drawImage(this.reds, this.dotsPaint[tempIndex].xCntr - this.radius, this.dotsPaint[tempIndex].yCntr - this.radius, this.radius * 2, this.radius * 2);
	      					if(this.lastMoveBool){
		      					this.ctx.beginPath();
				                this.ctx.arc(this.dotsPaint[tempIndex].xCntr, this.dotsPaint[tempIndex].yCntr, this.radius / 2, 0, 2*Math.PI, false);
				                this.ctx.lineWidth = 6;
				                this.ctx.strokeStyle = this.line_color;
				                this.ctx.fillStyle = this.line_color;
				                this.ctx.fill();
				                this.lastMoveIndex = tempIndex;
				            }
 
	      				}
	      				else{
	      					this.ctx.beginPath();
			                this.ctx.arc(this.dotsPaint[tempIndex].xCntr, this.dotsPaint[tempIndex].yCntr, this.radius, 0, 2*Math.PI, false);
			                this.ctx.lineWidth = 6;
			                this.ctx.strokeStyle = this.line_color;
			                this.ctx.fillStyle = this.bg_color;
			                this.ctx.stroke();
			                this.ctx.fill();

	      				}

	      				if(tempOwner === 1 || tempOwner === 0 && this.dotsPaint[tempIndex].owner === 2){
	      					tempInt = 1;
	      				}
	      				else{
	      					tempInt = -1;
	      				}
	      				this.dotsPaint[tempIndex].owner = tempOwner;

	      				//reactively draws hexagons
	      				if(i % 2 === 0){
	      					this.hexPainter((i-2) / 2, j - 2);
	      					this.hexPainter((i-2) / 2, j);
	      					this.hexPainter(i / 2, j - 1);		      					
	      			    }
	      			    else{
	      			    	this.hexPainter((i-3) / 2, j - 1);
	      					this.hexPainter((i-1) / 2, j - 2);
	      					this.hexPainter((i-1) / 2, j);
	      			    }
	      			    this.ctx.globalAlpha = 1;
	      			}
      			}
  			}
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
    for(j = 0; j < this.hexs.length; j++){
    	this.hexsPaint[j] = new Array();
        for(i = 0; i < this.hexs[0].length; i++){
            x = x + this.subx;
            if(this.hexs[j][i] === 1)
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
            this.hexsPaint[j][i] = new Hexagon(x, y);
        }
        x = this.subx;

        y += this.suby*3;
    }

    var i, j;
    var x = 0;
    var y = this.suby*2; //instead of 50

    var color = 1;
    for(j = 0; j < this.dots.length; j++){
        for(i = 0; i < this.dots[0].length; i++) {
            x = x + this.subx;
            if(this.dots[j][i] === 1)
                continue;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.radius, 0, 2*Math.PI, false);
            this.ctx.lineWidth = 6;
            this.ctx.strokeStyle = this.line_color;
            this.ctx.fillStyle = this.bg_color;
            this.ctx.stroke();
            this.ctx.fill();
            this.dotsPaint[color-1]= new Dot(color, x, y);
            // creates mask
            this.pixelContext.beginPath();
            this.pixelContext.arc(x, y, this.radius*1.5, 0, 2*Math.PI, false);
            this.pixelContext.lineWidth = 6;
            this.pixelContext.strokeStyle = this.line_color;
            this.pixelContext.fillStyle = decimalToHex(color);
            this.pixelContext.fill();
            color++;
        }
        var x = 0;
        if (j % 2 === 0){
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
  		this.dotPainter();

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
        "groups": 1
    }}).observe({

		added: (doc)=>{
			this.game = doc;
			this.turn = this.game.turn;
			this.dotPainter();

			if(this.game.result && Session.get('isGameFinished') === false){
				console.log("no way");
				Session.set('isGameFinished', true);
			}
		},

		changed: (doc,)=>{
			console.log("changed");
			console.log((new Date).getTime());
			this.lastMoveBool = true;
			this.game = doc;
			this.turn = this.game.turn;
			this.dotPainter();

			if(this.game.result && Session.get('isGameFinished') === false){
				Session.set('isGameFinished', true);
			}
		},
	});
});


Template.Canvas.events({
	'click'(event, instance) {
		console.log((new Date).getTime());
		if(instance.player !== 0 && instance.game.result === false){
			if((instance.player === 1 && instance.turn % 2 === 0) || (instance.player === 2 && instance.turn % 2 !== 0) ){
				var imageData = instance.pixelContext.getImageData(instance.coAdjuster * event.offsetX, instance.coAdjuster * event.offsetY, 1, 1).data;
			    var index = (imageData[0] << 16 | imageData[1] << 8 | imageData[2]) - 1;
			    if(index !== -1){ 
			    	this.tempData = instance.game.dotsData;
			    	indexToXY = function(tempData){
			    		for(i = 0; i < instance.dots.length; i++){
					        for(j = 0; j < instance.dots[0].length; j++){
					          	if(tempData[i][j]){
					            	if(tempData[i][j].index === index){
					              		k = i;
					              		m = j;
					            	}
					          	}
					        }
      					}
					}

					var k;
					var m;
					indexToXY(this.tempData);

			    	if(this.tempData[k][m].owner === 0){
						for(i = 0; i < 3; i++){
							if(this.tempData[k][m].neighbors[i]){
					          	tX = this.tempData[k][m].neighbors[i].x; //neighbor's x
					          	tY = this.tempData[k][m].neighbors[i].y; //neighbor's y
					          	if(this.tempData[tX][tY].owner === 0){  
							        tempNum = Number(FlowRouter.getParam('num'));
							        Meteor.call('games.makeTurn', k, m, instance.gameId, function (err, id){
       								console.log((new Date).getTime() + " HELLO");
       								});
							        console.log((new Date).getTime());
							        return
							    }
							}
						}

			    		tempGroupData = instance.game.groups;

			    		tempGroupData = new Array();
			            for(i = 0; i < instance.game.groups.length; i++){
			              if(instance.game.groups[i]){
			                tempGroupData[i] = instance.game.groups[i].libs;
			              }
			            }
			    		neighborGroups = new Array();
			    		neighborGroupCount = 0;
			    		for(i = 0; i < 3; i++){
							if(this.tempData[k][m].neighbors[i]){
					          	tX = this.tempData[k][m].neighbors[i].x; //neighbor's x
					          	tY = this.tempData[k][m].neighbors[i].y; //neighbor's y
							    if(this.tempData[tX][tY].owner === instance.player){
							    	if(neighborGroupCount === 0){
							    		neighborGroups[0] = this.tempData[tX][tY].group;
							    		tempGroupData[this.tempData[tX][tY].group]--;
							    		neighborGroupCount ++;
							    	}
							    	else{
							    		matchGroup = false;
							    		for (w = 0; w < neighborGroupCount; w++){
							    			if(this.tempData[tX][tY].group === neighborGroups[w]){
							    				tempGroupData[neighborGroups[w]]--;
							    				matchGroup = true;
							    				break;
							    			}
							    		}
							    		if(matchGroup === false){
							    			neighborGroups[neighborGroupCount] = this.tempData[tX][tY].group
							    			tempGroupData[this.tempData[tX][tY].group]--;
							    			neighborGroupCount ++;
							    		}
							    	}
							    }
							}
						}
						if(neighborGroupCount !== 0){
							for(z = 0; z < neighborGroupCount; z++){
								if(tempGroupData[neighborGroups[z]] > 0){

									tempNum = Number(FlowRouter.getParam('num'));
							        Meteor.call('games.makeTurn', k, m, instance.gameId, function (err, id){
       								console.log((new Date).getTime() + " HELLO");
       								});
							        console.log((new Date).getTime());
							        return;
								}
							}
						}
				    }
				}
		    }
		}
	}
});