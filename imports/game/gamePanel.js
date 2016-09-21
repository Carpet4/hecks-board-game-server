import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Games } from '../../imports/collections/games.js';
import { countdown } from './game.js';
import './gamePanel.html';

Template.GamePanel.onCreated(function(){

	this.gameId = FlowRouter.getParam('id');
	this.game = Games.findOne(this.gameId);
	this.kifu = this.game.kifu
	this.gameId = this.game._id;
	this.turn = this.game.turn;
	this.timeFixer = (new Date).getTime() - this.game.lastMoveTime;//fixes to correct time after page reload
	this.p1Clock = new ReactiveVar(this.game.p1Time);//clock1
	this.p2Clock = new ReactiveVar(this.game.p2Time);//clock2
	this.countdown = false;

	if(this.game.p1 === Meteor.userId()){
		this.player = 1;
	}
	else if(this.game.p2 === Meteor.userId()){
		this.player = 2;
	}
	else{
		this.player = 0;
	}

	if(!this.game.result){
		if(this.turn % 2 === 0){
			this.p1Clock.set(this.game.p1Time - this.timeFixer);
		}
		else{
			this.p2Clock.set(this.game.p2Time - this.timeFixer);
		}
	}

	


	this.clocksObserver = Games.find(this.gameId, {fields: {"result": 1, "p1Time": 1, "p2Time": 1, "turn": 1, "kifu": 1}}).observe({
		changed: (doc)=>{
			this.p1Clock.set(doc.p1Time);
			this.p2Clock.set(doc.p2Time);
			this.game.result = doc.result;
			this.kifu = doc.kifu;
			if(doc.turn !== this.turn && this.countdown === true){
				countdown.pause();
				countdown.currentTime = 0;
				this.countdown = false;
			}
			this.turn = doc.turn;

			//cancels the interval when game is finished
			if(this.game.result !== false){
				this.clockWorker.terminate();
				if(this.countdown === true){
					countdown.pause();
					this.countdown = false;
				}
			}
		}
	});

	//fixes to correct time after reload using this.timeFixer
	if(!this.game.result){
		if(this.turn % 2 === 0){
			this.p1Clock.set(this.game.p1Time - this.timeFixer);
		}
		else{
			this.p2Clock.set(this.game.p2Time - this.timeFixer);
		}
	}

	//interval that decreases a second at a time (client only) for the player whose turn it is, 
	if(!this.game.result){
		if(typeof(this.clockWorker) == "undefined") {
	    	this.clockWorker = new Worker("/clockWorker.js");
		}
		this.clockWorker.onmessage = (event)=>{
		    if(this.turn % 2 === 0){
				var time = this.p1Clock.get();
				if(time < 10100 && this.countdown === false){
					countdown.currentTime = Math.max(0, 10000 - time);
					countdown.play();
					this.countdown = true;
				}
				this.p1Clock.set(time - 100);
				if(this.player === 2 && this.p1Clock.get() <= 0){
					Meteor.call('games.timeLoss', this.gameId);
				}
			}
			else{
				var time = this.p2Clock.get();
				if(time < 10100 && this.countdown === false){
					countdown.currentTime = Math.max(0, 10000 - time);
					countdown.play();
					this.countdown = true;
				}
				this.p2Clock.set(time - 100);
				if(this.player === 1 && this.p2Clock.get() <= 0){
					Meteor.call('games.timeLoss', this.gameId);
				}
			}
		}; 
	}
	this.autorun(()=>{
		var variation = Session.get('myVar')
		if(variation){
			var num = Number(variation[0]) + variation.length - 1;
			document.getElementById('moveNumber').value = num;
		}
	})	

});

Template.GamePanel.onDestroyed(function () {
	if(this.clockWorker) {
	    this.clockWorker.terminate();
	}
	
});

Template.GamePanel.helpers({
	isFinished: ()=>{
		if(Template.instance().game.result){
			return true;
		}
		else{
			return false;
		}
	},

  	clock1: ()=> {
  		rawTime = Math.ceil(Template.instance().p1Clock.get() / 1000);
  		minutes = Math.floor(rawTime / 60);
  		seconds = rawTime - (minutes * 60);
  		return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  	},

  	clock2: ()=> {
  		rawTime = Math.ceil(Template.instance().p2Clock.get() / 1000);
  		minutes = Math.floor(rawTime / 60);
  		seconds = rawTime - (minutes * 60);
  		return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  	},

  	redClock1: ()=> {
  		return (Math.ceil(Template.instance().p1Clock.get() / 1000) < 11);
  	},

  	redClock2: ()=> {
  		return (Math.ceil(Template.instance().p2Clock.get() / 1000) < 11);
  	},

  	timeInc: ()=> {
  		return "(+" + Template.instance().game.subT + ")";
  	},

  	player1: ()=> {//not supposed to be here
   		game = Template.instance().game;
    	return game.name1 + "(" + Math.floor(game.rating1) + ")";
  	},

  	player2: ()=> {//not supposed to be here
    	game = Template.instance().game;
    	return game.name2 + "(" + Math.floor(game.rating2) + ")";
  	},

  	turn: ()=> {
  		game = Games.findOne(Template.instance().gameId);
  		if(!game.result){
  			if(game.turn % 2 === 0){
  				return game.name1 + "'s turn";
  			}
  			else{
  				return game.name2 + "'s turn";
  			}
  		}
  		else{
  			return game.result;
  		}	
  	}

});


Template.GamePanel.events({

	'click .resign'(event, instance) {
      Meteor.call('games.resign', instance.gameId);
    },

    'click .pass'(event, instance) {
      Meteor.call('games.pass', instance.gameId);
    },

    'click .shareVar'(event, instance) {
    	if(Session.get('myVar'))
     		Meteor.call('messages.variationInsert', Session.get('myVar'), instance.gameId);
    },

    'submit .changeMove'(event, instance){
		event.preventDefault();
		var num = Number(event.target.num.value);
		if(num < 0){
			document.getElementById('moveNumber').value = 0;
		}
		else{
			var variation = Session.get('myVar');
			if(variation){
				if(num > variation[0] + variation.length - 1){
					document.getElementById('moveNumber').value = variation[0] + variation.length - 1;
				}
				else{
					document.getElementById('moveNumber').value = num;
				}
			}
			else{
				if(num > instance.game.kifu.length){
					document.getElementById('moveNumber').value = instance.kifu.length;
				}
				else{
					document.getElementById('moveNumber').value = num;
				}
			}
		}
		Session.set('moveNum', document.getElementById('moveNumber').value);
	},

	'click .back10'(event){
		var num = Number(document.getElementById('moveNumber').value);
		num -= 10;
		if(num < 0){
			document.getElementById('moveNumber').value = 0;
		}
		else{
			document.getElementById('moveNumber').value = num;
		}
		Session.set('moveNum', document.getElementById('moveNumber').value);
	},

	'click .back1'(event){
		var num = Number(document.getElementById('moveNumber').value);
		num -= 1;
		if(num < 0){
			document.getElementById('moveNumber').value = 0;
		}
		else{
			document.getElementById('moveNumber').value = num;
		}
		Session.set('moveNum', document.getElementById('moveNumber').value);
	},

	'click .forward1'(event, instance){
		var num = Number(document.getElementById('moveNumber').value);
		num += 1;

		var variation = Session.get('myVar');
		if(variation){
			if(num > variation[0] + variation.length - 1){
				document.getElementById('moveNumber').value = variation[0] + variation.length - 1;
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		else{
			if(num > instance.game.kifu.length){
				document.getElementById('moveNumber').value = instance.kifu.length;
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		Session.set('moveNum', document.getElementById('moveNumber').value);
	},

	'click .forward10'(event, instance){
		var num = Number(document.getElementById('moveNumber').value);
		num += 10;

		var variation = Session.get('myVar');
		if(variation){
			if(num > variation[0] + variation.length - 1){
				document.getElementById('moveNumber').value = variation[0] + variation.length - 1;
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		else{
			if(num > instance.game.kifu.length){
				document.getElementById('moveNumber').value = instance.kifu.length;
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		Session.set('moveNum', document.getElementById('moveNumber').value);
	},
});