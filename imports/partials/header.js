import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Rooms } from '../../imports/collections/rooms.js';
import { Notifications } from '../../imports/collections/notifications.js';
import './header.html';

Template.Header.onCreated(function(){
  this.subscribe('rooms');
  this.subscribe('users');
  this.subscribe('notifications');
});

Template.Header.helpers({
	   username: ()=>{
      	return Meteor.users.findOne(Meteor.userId()).username;
  	},

  	notifications: ()=>{
  		return Notifications.find();
  	},

    notificationExists: ()=>{
      if(Notifications.find().count() > 0){
        return true;
      }
    }

});

Template.Header.events({

	'click .dropdown-menu'(event) {
		event.stopPropagation();
	},

});

Template.Notification.helpers({  

  roomName: (id)=>{
    room = Rooms.findOne(id);
    if(room)
      return room.name;
  },

  idToName: (id)=>{
    console.log(id);
    return Meteor.users.findOne(id).username;
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
