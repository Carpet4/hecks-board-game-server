import './pvbCanvas.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { winSound, lossSound, passSound } from '../gameSounds/gameSounds.js';
import { hasLibs, makeTurn, count} from '../gameFunctions/logics.js';
import { canvasResizer, boardPainter, CMM, boardRenderer, zoomFirst, zoomIn, zoomOut } from '../gameFunctions/paint.js';
import { setBoard } from '../gameFunctions/setBoard.js';


Template.PvbCanvas.onDestroyed(function(){
	Session.set('isGameFinished', false);
	$(window).off('resize');
	Session.set('canStartReview', false);
	Session.set("botResult", "");
	Session.set("turn", 0);
	this.botWorker.terminate();
});
        
Template.PvbCanvas.onCreated(function(){

	Session.set("turn", 0);
	Session.set('globalVar', false);

	if($(window).width() < 545 || $(window).height() < 545){
		this.zoomFirst = true;
	}
	else{
		this.zoomFirst = false;
	}

	Session.set('myVar', false);
	this.botWorker = new Worker("/botWorker.js");
	this.isZoomed = false;
	this.passCount = 0;
	this.result = false;
	this.turn = 0;
	this.player = 1;
	this.canvasW = 880;
	this.canvasH = 800;
	this.currentVariation = false;
	this.lastGVar = false;
	if(!this.result){
		Session.set('isGameFinished', false);
		Session.set('canStartReview', false);

	}
	else if(!Session.get('isGameFinished')){
		Session.set('isGameFinished', true);
		

	}

	$(window).resize(()=> {
		this.coAdjuster = canvasResizer(this.canvas, this.canvas2, this.maskCanvas, this.canvasW, this.canvasH);
  	});
	
});

Template.PvbCanvas.onRendered(function() {

	this.canvas = document.getElementById("canvas1");
    this.ctx = this.canvas.getContext("2d");
    this.canvas2 = document.getElementById("canvas2");
    this.ctx2 = this.canvas2.getContext("2d");
    this.maskCanvas = document.getElementById("subCanvas");
    this.maskCanvas.style.display = "none";
    this.pixelContext = this.maskCanvas.getContext("2d");
    this.dotsPaint = [];
    this.hexsPaint = [];
    this.dotsData = [];
    this.hexsData = [];
    this.kifu = [];
    this.lastMove = {x: null, y: null, exists: false};

	boardRenderer(this.canvas, this.ctx, this.ctx2, this.pixelContext, this.hexsPaint, this.dotsPaint);

    this.coAdjuster = canvasResizer(this.canvas, this.canvas2, this.maskCanvas, this.canvasW, this.canvasH);

    var newBoard = setBoard(this.kifu.length, false, this.hexsData, this.dotsData, this.kifu, this.lastMove);
	this.dotsData = newBoard[0];
	this.hexsData = newBoard[1];
	boardPainter(this.ctx, this.ctx2, this.hexsPaint, this.dotsPaint, this.hexsData, this.dotsData, this.lastMove, this.currentVariation);
  	

		this.botWorker.onmessage = (event)=>{
			if(event.data.length !== 3){
				this.turn++;
				Session.set('turn', this.turn);
				makeTurn(event.data, this.turn, this.dotsData, this.hexsData, this.lastMove, this.kifu, this.result);
				boardPainter(this.ctx, this.ctx2, this.hexsPaint, this.dotsPaint, this.hexsData, this.dotsData, this.lastMove, this.currentVariation);
				if(event.data === "pass"){
					this.passCount++;
					if(this.passCount > 1){
						var pointsResult = count(this.hexsData);
						if(pointsResult > 0){
							this.result = "You won by "+pointsResult+"!";
							winSound.play();
						}
						else{
							this.result = "You lost by "+Math.abs(pointsResult)+ " :(";
							lossSound.play();
						}
						Session.set('PVBKlength', this.kifu.length);
						Session.set("turn", this.result);
						Session.set('isGameFinished', true);
					}
					passSound.play();
				}
				else
					this.passCount = 0;
			}
			else{
				if(event.data === "res"){
					Session.set('PVBKlength', this.kifu.length);
					this.result = "You won by resignation!";
					Session.set("turn", this.result);
					Session.set('isGameFinished', true);
					winSound.play();
				}
			}
			
		};



	this.autorun(()=>{
		if(Session.get('canStartReview')){
			var num = Session.get('moveNumBool');
			num = Number(document.getElementById('moveNumber').value);
			if(this.result !== false){
				if(num == 0 || (this.currentVariation && num < this.currentVariation[0])){
					this.currentVariation = false;
					Session.set('myVar', false);
					this.lastGVar = false;
					Session.set('globalVar', false);
				}
				console.log(num, this.currentVariation);
				var newBoard = setBoard(num, this.currentVariation, this.hexsData, this.dotsData, this.kifu, this.lastMove);
				this.dotsData = newBoard[0];
				this.hexsData = newBoard[1];
				this.turn = num;
				boardPainter(this.ctx, this.ctx2, this.hexsPaint, this.dotsPaint, this.hexsData, this.dotsData, this.lastMove, this.currentVariation);
			}
		}
	});


	this.autorun(()=>{
		var pass = Session.get('pvbPass');
		if(pass && (this.turn%2) + 1 === this.player){
			this.turn++;
			Session.set('turn', this.turn);
			makeTurn("pass", this.turn, this.dotsData, this.hexsData, this.lastMove, this.kifu, this.result);
			boardPainter(this.ctx, this.ctx2, this.hexsPaint, this.dotsPaint, this.hexsData, this.dotsData, this.lastMove, this.currentVariation);
			this.passCount++;
			if(this.passCount > 1){
				var pointsResult = count(this.hexsData);
				if(pointsResult > 0){
					this.result = "You won by "+pointsResult+"!";
					winSound.play();
				}
				else{
					this.result = "You lost by "+Math.abs(pointsResult)+ " :(";
					lossSound.play();
				}
				Session.set('PVBKlength', this.kifu.length);
				Session.set("turn", this.result);
				Session.set('isGameFinished', true);
			}
			else{
				this.botWorker.postMessage("pass");
			}
			passSound.play();
		}
		Session.set('pvbPass', false);
	});

	this.autorun(()=>{
		var res = Session.get('pvbRes');
		if(res){
			this.result = "You lost by resignation :(";
			Session.set('PVBKlength', this.kifu.length);
			Session.set("turn", this.result);
			Session.set('isGameFinished', true);
			lossSound.play();
			Session.set('pvbRes', false);
		}
	});



	$( "#canvas1" ).mousemove((event)=>{
		if(!this.isZoomed){
			if((this.turn % 2)+1 === this.player || this.result !== false){
				CMM(event, this.ctx, this.pixelContext, this.coAdjuster, this.dotsData, this.dotsPaint, (this.turn%2+1));
			}
		}
	});
});

Template.PvbCanvas.events({

	'click'(event, instance) {
		console.log("gets event");
		if((instance.player === 1 && instance.turn % 2 === 0) || (instance.player === 2 && instance.turn % 2 !== 0) || instance.result !== false){
			if(zoomFirst() && !instance.isZoomed){
				zoomIn(event, instance);
				return;
			}

			var imageData = instance.pixelContext.getImageData(instance.coAdjuster * event.offsetX, instance.coAdjuster * event.offsetY, 1, 1).data;
		    var k = imageData[1] -1;
			var m = imageData[2] -1;
		    if(k > -1 && imageData[3] === 255){
		    	var player = instance.turn % 2 + 1; 
				if(instance.dotsData[k][m] === 0 && hasLibs(k, m, player, instance.dotsData)){
	    	
			        if(instance.isZoomed){
			        	zoomOut(instance);
			    	}
			    	var moveString = m.toString(36) + k.toString(36);
			    	if(instance.result === false){
			        	instance.botWorker.postMessage(moveString);
			        	console.log(moveString);
			        	instance.turn++;
			        	instance.passCount = 0;
			        	Session.set('turn', instance.turn);
			    		makeTurn(moveString, instance.turn, instance.dotsData, instance.hexsData, instance.lastMove, instance.kifu, instance.result);
			    		boardPainter(instance.ctx, instance.ctx2, instance.hexsPaint, instance.dotsPaint, instance.hexsData, instance.dotsData, instance.lastMove, instance.currentVariation);
			    	}
			    	else{
			    		var variation;
			    		if(Session.get('myVar')){
			    			variation = Session.get('myVar');
			    			var placement = instance.turn + 1 - variation[0];
			    			variation[placement] = moveString;
			    			variation.splice(placement+1);
			    		}
			    		else{
			    			variation = [];
			    			variation.push(Number(document.getElementById('moveNumber').value));
			    			variation.push(moveString);
			    		}
			    		instance.currentVariation = variation;
			    		console.log(variation);
			    		Session.set('myVar', variation);
			    		instance.turn++;
			    		makeTurn(moveString, instance.turn, instance.dotsData, instance.hexsData, instance.lastMove, instance.kifu, instance.result);
			    		boardPainter(instance.ctx, instance.ctx2, instance.hexsPaint, instance.dotsPaint, instance.hexsData, instance.dotsData, instance.lastMove, instance.currentVariation);	
			    	}
			        return;
			    }  
			}
			if(instance.isZoomed){
				zoomOut(instance);
	    	}
	    }
	}
});