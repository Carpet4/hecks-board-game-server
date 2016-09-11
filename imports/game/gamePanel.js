import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Games } from '../../imports/collections/games.js';
import './gamePanel.html';

Template.GamePanel.onCreated(function(){

	this.gNum = Number(FlowRouter.getParam('num'));
	this.game = Games.findOne({gNum: this.gNum});
	this.gameId = this.game._id;
	this.turn = this.game.turn;
	this.timeFixer = (new Date).getTime() - this.game.lastMoveTime;//fixes to correct time after page reload
	this.p1Clock = new ReactiveVar(this.game.p1Time);//clock1
	this.p2Clock = new ReactiveVar(this.game.p2Time);//clock2

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

	this.clocksObserver = Games.find(this.gameId, {fields: {"result": 1, "p1Time": 1, "p2Time": 1, "turn": 1}}).observe({

		changed: (doc)=>{
			console.log("clocks " + (new Date).getTime());
			this.p1Clock.set(doc.p1Time);
			this.p2Clock.set(doc.p2Time);
			this.turn = doc.turn;

			//cancels the interval when game is finished
			if(this.game.result !== false){
				Meteor.clearInterval(this.clockInterval);
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
		this.clockInterval = Meteor.setInterval(()=> {
			if(this.turn % 2 === 0){
				this.p1Clock.set(this.p1Clock.get() - 1000);
				if(this.player === 2 && this.p1Clock.get() <= 0){
					Meteor.call('games.timeLoss', this.gameId);
				}
			}
			else{
				this.p2Clock.set(this.p2Clock.get() - 1000);
				if(this.player === 1 && this.p2Clock.get() <= 0){
					Meteor.call('games.timeLoss', this.gameId);
				}
			}
		} ,1000);
	}	

});

Template.GamePanel.onDestroyed(function () {
	Meteor.clearInterval(this.clockInterval);
});

Template.GamePanel.helpers({
	//clocks display
  	clock1: ()=> {
  		rawTime = Math.floor(Template.instance().p1Clock.get() / 1000);
  		minutes = Math.floor(rawTime / 60);
  		seconds = rawTime - (minutes * 60);
  		return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  	},

  	clock2: ()=> {
  		rawTime = Math.floor(Template.instance().p2Clock.get() / 1000);
  		minutes = Math.floor(rawTime / 60);
  		seconds = rawTime - (minutes * 60);
  		return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  	},

  	redClock1: ()=> {
  		return (Math.floor(Template.instance().p1Clock.get() / 1000) < 11);
  	},

  	redClock2: ()=> {
  		return (Math.floor(Template.instance().p2Clock.get() / 1000) < 11);
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
  		game = Games.findOne({gNum: Template.instance().gNum});
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
      var tempNum = Number(FlowRouter.getParam('num'));
      Meteor.call('games.resign', tempNum);
    },

    'click .pass'(event, instance) {
      var tempNum = Number(FlowRouter.getParam('num'));
      Meteor.call('games.pass', tempNum);
    }
});