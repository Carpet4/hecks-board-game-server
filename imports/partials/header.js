import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Rooms } from '../../imports/collections/rooms.js';
import { Games } from '../../imports/collections/games.js';
import { Notifications } from '../../imports/collections/notifications.js';
import './header.html';

Template.Header.onCreated(function(){
  this.subscribe('rooms');
  this.subscribe('users');
  this.subscribe('notifications');
  this.subscribe('playerGames');
  this.notificationSound = new Audio();
  this.gameStartSound = new Audio();
  this.notificationCount = 0;
  this.activeGame = false;
  setTimeout(()=>{
    this.notificationSound.src = "/notification.mp3";
    this.gameStartSound.src = "/gameStart.mp3";
  }, 8000);
});

Template.Header.helpers({
	   username: ()=>{
      	return Meteor.users.findOne(Meteor.userId()).username;
  	},

  	notifications: ()=>{
  		return Notifications.find();
  	},

    notificationExists: ()=>{
      var count = Notifications.find().count();
      if(count > 0){
        if(count > Template.instance().notificationCount){
          var sound = Template.instance().notificationSound;
          if(sound.src){
            sound.play()
          }
        }
        Template.instance().notificationCount = count;
        return true;
      }
      Template.instance().notificationCount = count;
    },
    activeGames: ()=>{
      var game = Games.findOne({result: false, $or:[{p1: Meteor.userId()}, {p2: Meteor.userId()}]});
      if(game){
        if(!Template.instance().activeGame){
          Template.instance().activeGame = true;
          var sound = Template.instance().gameStartSound;
          if(sound.src){
            sound.play()
          }
        }
        var timeOuter = game.p1Time + 3000 + Math.random() * 10000;
        Meteor.setTimeout(function(){
          Meteor.call('games.timeLoss', game._id);
        }, timeOuter);
        return true;
      }
      Template.instance().activeGame = false;
    }

});

Template.Header.events({

	'click .dropdown-menu'(event) {
		event.stopPropagation();
	},

  'click #logoutBtn'() {
    AccountsTemplates.logout();
  },

  'click .navbar-brand'(){
    FlowRouter.go('about');
  }

});

Template.Notification.helpers({  

  roomName: (id)=>{
    room = Rooms.findOne(id);
    if(room)
      return room.name;
  },

  idToName: (id)=>{
    return Meteor.users.findOne(id).username;
  } 
});

Template.Notification.helpers({

  timeDisplay: (time)=>{
    hours = Math.floor(time / 3600);
    minutes = Math.floor((time - hours*3600) / 60);
    seconds = time - (hours * 3600) - (minutes * 60);

    var result = "";

    if(hours > 0){
      result += (hours + "h ");
    }
    if(minutes > 0){
      result += (minutes + "m ");
    }
    if(seconds > 0){
      result += (seconds + "s");
    }

    return result;

  }

});

Template.Notification.events({

  'click .roomJoin'(event) {
    event.preventDefault();
    event.stopPropagation();
    Meteor.call('rooms.join', event.target.value);
  },

  'click .roomDecline'(event) {
    event.preventDefault();
    event.stopPropagation();
    Meteor.call('rooms.decline', event.target.value);
  },

  'click .gameDecline'(event) {
    event.preventDefault();
    event.stopPropagation();
    Meteor.call('notifications.gameDecline', event.target.value);
  },

  'click .gameAccept'(event) {
    event.preventDefault();
    event.stopPropagation();
    Meteor.call('notifications.gameAccept', event.target.value);
  }

});
