import { ReactiveVar } from 'meteor/reactive-var';
import { AutomatchPlayers } from '../../imports/collections/automatchPlayers.js';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './play.html';

//checks if automatch is running
Template.Play.onCreated(function bodyOnCreated() {
	this.subscribe('automatchPlayers');
  
  this.minTime = 10;
  this.maxTime = 10;
  this.minRank = -300;
  this.maxRank = +300;

  this.autorun(() => {
    if (this.subscriptionsReady()) {
      var result = Meteor.user().activeGames[0];
      if (result !== undefined) {
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
    console.log("1");
    if(!AutomatchPlayers.findOne({user: Meteor.userId()})){
      console.log("2");
      Meteor.call('automatchPlayers.insert', instance.minTime, instance.maxTime, instance.minRank, instance.maxRank);
    }
  },

  'click .automatchRemove'(event, instance) {

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