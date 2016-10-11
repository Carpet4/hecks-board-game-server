import { ReactiveVar } from 'meteor/reactive-var';
import { AutomatchPlayers } from '../../imports/collections/automatchPlayers.js';
import { Games } from '../../imports/collections/games.js';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './play.html';

//!!!!need to make sure player is removed from automatch if he started a game outside of the automatch
Template.Play.onCreated(function bodyOnCreated() {
	this.subscribe('automatchPlayers');
  this.subscribe('activeGames');
  
  this.minTime = 20;
  this.maxTime = 30;
  this.minRank = -300;
  this.maxRank = +300;

  this.autorun(() => {
    if (this.subscriptionsReady()) {
      var foundGame = Games.findOne({result: false, $or:[{p1: Meteor.userId()}, {p2: Meteor.userId()}]});
      if(foundGame){
        var result = foundGame._id;
        FlowRouter.go('/game/' + result);
      }
    }
  });
});






Template.Play.helpers({

  //handles the automatch button
  isAutomatch: function(){
    if(AutomatchPlayers.findOne({user: Meteor.userId()})){
      return true;
    }
    return false;
  }

});






Template.Play.events({

	'click .automatchInsert'(event, instance) {
    if(!AutomatchPlayers.findOne({user: Meteor.userId()})){
      Meteor.call('automatchPlayers.insert', instance.minTime, instance.maxTime, instance.minRank, instance.maxRank);
    }
  },

  'click .automatchRemove'() {
      Meteor.call('automatchPlayers.remove');
  },

  'change .minTime'(event, instance) {
    instance.minTime = Number(event.target.value);
  },

  'change .maxTime'(event, instance) {
    instance.maxTime = Number(event.target.value);
  },

  'change .minRank'(event, instance) {
    instance.minRank = Number(event.target.value);
  },

  'change .maxRank'(event, instance) {
    instance.maxRank = Number(event.target.value);
  },
});