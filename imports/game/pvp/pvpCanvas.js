import './pvpCanvas.html';
import { Games } from '../../../imports/collections/games.js';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { winSound, lossSound } from '../gameSounds/gameSounds.js';
import { findPlayer, hasLibs, makeTurn} from '../gameFunctions/logics.js';
import { canvasResizer, boardPainter, CMM, boardRenderer, zoomFirst, zoomIn, zoomOut } from '../gameFunctions/paint.js';
import { setBoard } from '../gameFunctions/setBoard.js';


Template.PvpCanvas.onDestroyed(function(){
	Session.set('isGameFinished', false);
	Session.set('canStartReview', false);
	$(window).off('resize');
});
        
Template.PvpCanvas.onCreated(function(){

	Session.set('globalVar', false);

	if($(window).width() < 545 || $(window).height() < 545){
		this.zoomFirst = true;
	}
	else{
		this.zoomFirst = false;
	}

	Session.set('myVar', false);
	this.isZoomed = false;
	this.gameId = FlowRouter.getParam('id');
	this.game = Games.findOne(this.gameId);
	this.player = findPlayer(this.game.p1, this.game.p2);
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

	$(window).resize(()=> {
		this.coAdjuster = canvasResizer(this.canvas, this.canvas2, this.maskCanvas, this.canvasW, this.canvasH);
  	});
	
});

Template.PvpCanvas.onRendered(function() {

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
    this.lastMove = {x: null, y: null, exists: false};

	boardRenderer(this.canvas, this.ctx, this.ctx2, this.pixelContext, this.hexsPaint, this.dotsPaint);

    this.coAdjuster = canvasResizer(this.canvas, this.canvas2, this.maskCanvas, this.canvasW, this.canvasH);

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
			//Session.set('moveNum', this.kifu.length);

			
			var newBoard = setBoard(this.kifu.length, false, this.hexsData, this.dotsData, this.kifu, this.lastMove);
			this.dotsData = newBoard[0];
			this.hexsData = newBoard[1];
			boardPainter(this.ctx, this.ctx2, this.hexsPaint, this.dotsPaint, this.hexsData, this.dotsData, this.lastMove, this.currentVariation);

			if(this.game.result && Session.get('isGameFinished') === false){
				Session.set('isGameFinished', true);
			}
		},

		changed: (doc)=>{
			if(!doc.result){
				this.turn++;
				makeTurn(doc.lastMove, this.turn, this.dotsData, this.hexsData, this.lastMove, this.kifu, doc.result);
				boardPainter(this.ctx, this.ctx2, this.hexsPaint, this.dotsPaint, this.hexsData, this.dotsData, this.lastMove, this.currentVariation);
			}
			else{
				this.game.result = doc.result;
				var letter = Number(doc.result.charAt(2));
				if(Number.isInteger(letter)){
					this.turn++;
					makeTurn(doc.lastMove, this.turn, this.dotsData, this.hexsData, this.lastMove, this.kifu, doc.result);
					boardPainter(this.ctx, this.ctx2, this.hexsPaint, this.dotsPaint, this.hexsData, this.dotsData, this.lastMove, this.currentVariation);
				}
				var letter2 = doc.result.charAt(0);
				if((this.player === 1 && letter2 === "S") || (this.player === 2 && letter2 === "G")){
					winSound.play();
				}
				else if(this.player > 0){
					lossSound.play();
				}
				if(Session.get('isGameFinished') === false){
					Session.set('isGameFinished', true);
				} 
			
			}
		},
	});


	this.autorun(()=>{
		var gVar = Session.get('globalVar');
		if(gVar && (!this.lastGVar || gVar.join() !== this.lastGVar.join())){
			this.lastGVar = gVar;
			this.currentVariation = gVar;
			Session.set('myVar', gVar);
			var newBoard = setBoard(gVar[0] + gVar.length - 1, gVar, this.hexsData, this.dotsData, this.kifu, this.lastMove);
			this.dotsData = newBoard[0];
			this.hexsData = newBoard[1];
			this.turn = gVar[0] + gVar.length - 1;
			boardPainter(this.ctx, this.ctx2, this.hexsPaint, this.dotsPaint, this.hexsData, this.dotsData, this.lastMove, this.currentVariation);
		}
	});

	this.autorun(()=>{
		if(Session.get('canStartReview')){
			var num = Session.get('moveNumBool');
			num = Number(document.getElementById('moveNumber').value);
			if(this.game.result !== false){
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

	$( "#canvas1" ).mousemove((event)=>{
		if(!this.isZoomed){
			if((this.turn % 2)+1 === this.player || this.game.result !== false){
				CMM(event, this.ctx, this.pixelContext, this.coAdjuster, this.dotsData, this.dotsPaint, (this.turn%2+1));
			}
		}
	});
});

Template.PvpCanvas.events({

	'click'(event, instance) {
		if((instance.player === 1 && instance.turn % 2 === 0) || (instance.player === 2 && instance.turn % 2 !== 0) || instance.game.result !== false){
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
			    	if(instance.game.result === false){
			        	Meteor.call('games.makeTurn', k, m, instance.gameId);
			    	}
			    	else{
			    		var moveString = m.toString(36) + k.toString(36);
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