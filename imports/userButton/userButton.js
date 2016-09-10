import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Rooms } from '../../imports/collections/rooms.js';
import {MessangerWindows} from '../../imports/partials/messanger.js';

import './userButton.html';

Template.RoomUserButton.helpers({
	
  	isOwner: (id)=> {
		return !!(Rooms.findOne(Session.get('currentChat')).owner === id);
	},

	isModerator: (id)=> {
		if(Rooms.findOne({_id: Session.get('currentChat'), moderators: id}))
			return true;
	},

	isPrivate: ()=> {
		return Rooms.findOne(Session.get('currentChat')).isPrivate;
	},

	checkIfSelf: (id)=> {
		return !(Meteor.userId()===id);
	},

	isMember: (id)=> {
		if(Rooms.findOne({_id: Session.get('currentChat'), users: id}))
			return true;
	},
});

Template.UserButton.helpers({

	checkIfSelf: (id)=> {
		return !(Meteor.userId()===id);
	},

});

Template.RoomUserButton.events({
	'click .makeMod'(event){
		Meteor.call('rooms.makeMod', Session.get('currentChat'), event.target.value);
	},

	'click .disMod'(event){
		Meteor.call('rooms.disMod', Session.get('currentChat'), event.target.value);
	},

	'click .kick'(event){
		Meteor.call('rooms.kick', Session.get('currentChat'), event.target.value);
	},

	'click .cancelInvite'(event){
		Meteor.call('rooms.cancelInvite', Session.get('currentChat'), event.target.value);
	},

	'click .openModal'(event) {
        event.preventDefault();
       	Modal.show('PlayModal', event.target.value);
    },

    'click .startChat'(event) {
    	chatee = event.target.value;
    	this.room = Rooms.findOne({type: "messanger", users: {$all: [Meteor.userId(), chatee]}});
       	if(!this.room){
       		Meteor.call('rooms.createMessanger', chatee, function (err, id){
       		MessangerWindows.insert({roomId: id, state: "open", chatee: chatee})
       		});
       	}
       	else{
       		this.clientRoom = MessangerWindows.findOne({roomId: this.room._id});
       		if(!this.clientRoom){
       			MessangerWindows.insert({roomId: this.room._id, state: "open", chatee: chatee});
       		}
       		else{
       			MessangerWindows.update({roomId: this.room._id}, {$set: {state: "open"}});
       		}
       	}

    },
});

Template.UserButton.events({

	'click .openModal'(event) {
        event.preventDefault();
       	Modal.show('PlayModal', event.target.value);
    },

    'click .startChat'(event) {
    	chatee = event.target.value;
    	this.room = Rooms.findOne({type: "messanger", users: {$all: [Meteor.userId(), chatee]}});
       	if(!this.room){
       		Meteor.call('rooms.createMessanger', chatee, function (err, id){
       		MessangerWindows.insert({roomId: id, state: "open", chatee: chatee})
       		});
       	}
       	else{
       		this.clientRoom = MessangerWindows.findOne({roomId: this.room._id});
       		if(!this.clientRoom){
       			MessangerWindows.insert({roomId: this.room._id, state: "open", chatee: chatee});
       		}
       		else{
       			MessangerWindows.update({roomId: this.room._id}, {$set: {state: "open"}});
       		}
       	}

    },
});

Template.PlayModal.events({  

    'submit .gameInvite'(event, instance) {
    	event.preventDefault();
    	//console.log(event.target.submit.value + " " + event.target.timeInc.value  + " " + event.target.timeMain.value);	
    	Meteor.call('notifications.gameInvite', event.target.submit.value, Number(event.target.timeMain.value), Number(event.target.timeInc.value));
    	Modal.hide('playModal');
	}

});