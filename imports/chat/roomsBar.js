import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Rooms } from '../../imports/collections/rooms.js';

//need to fix everything marked as read when going back to chat

import './roomsBar.html';
Template.RoomsBar.onCreated(function(){
	this.newRoom = new ReactiveVar(false);
	CommunityChats = new Meteor.Collection(null);
	Session.set('currentChat', false);

	lastRead = Meteor.user().lastRead.community;
	if(lastRead === Infinity){
		lastRead = (new Date).getTime();
		console.log("horray");
	}
	else{
		setTimeout(function(){
			if(Meteor.user().lastRead.community < Infinity){
				Meteor.call('users.infiniteLastReadC');
			}
		}, 5000);		
	}

	CommunityChatsObserver = Rooms.find({type: "community", users: Meteor.userId()}).observe({
		added: function(doc){
			console.log(Session.get('currentChat'));
			if(Session.get('currentChat') === false){
				console.log("this is false");
				CommunityChats.insert({roomId: doc._id, state: "open"});
				Session.set('currentChat', doc._id);

			}
			if(doc.lastMessage > lastRead){
				CommunityChats.insert({roomId: doc._id, state: "unRead"});
			}
			else{
				CommunityChats.insert({roomId: doc._id, state: "read"});
			}
		},

		changed: function(doc){
			this.activeRoom = CommunityChats.findOne({roomId: doc._id});
			if(this.activeRoom.state !== "open"){
				CommunityChats.update(this.activeRoom._id, {$set: {state: "unRead"}});
			}
		},

		removed: function(doc){
			CommunityChats.remove({roomId: doc._id});
		}
	});		
});

Template.RoomsBar.helpers({

	newRoom: ()=> {
		return Template.instance().newRoom.get();
	},

	//available rooms
	avaRooms: ()=> {
		return Rooms.find({type: "community", users: {$ne: Meteor.userId()}});
	},

	activeRooms: ()=> {
		return Rooms.find({type: "community", users: Meteor.userId()});
	},


});

Template.RoomsBar.events({
	'submit form'(event){
		event.preventDefault();
		this.name = event.target.roomName.value;
		this.isPrivate = event.target.isPrivate.checked;
		if(this.name.length > 0)
			Meteor.call('rooms.create', this.name, this.isPrivate);
		event.target.roomName.value = "";
		event.target.isPrivate.checked = false;
	},

	'click .newRoom'(event, instance){
		instance.newRoom.set(!instance.newRoom.get());
	},

	'click .activeRoom'(event){
		roomId = event.target.value;
		CommunityChats.update({state: "open"}, {$set: {state: "read"}})
		CommunityChats.update({roomId: roomId}, {$set: {state: "open"}})

		Session.set('currentChat', roomId);
	},

	'click .avaRoom'(event, instance){
		Meteor.call('rooms.join', event.target.value);
	}
});

Template.ActiveRoomOnList.events({

	'click .leaveRoom'(event){
		Meteor.call('rooms.leave', event.target.value);
	},
});

Template.ActiveRoomOnList.helpers({

	isUnRead: (id)=> {
		room = CommunityChats.findOne({roomId: id});
		if(room){
			if(room.state === "unRead"){
				return true;
			}
		}
	},

	isOpen: (id)=> {
		room = CommunityChats.findOne({roomId: id});
		if(room){
			if(room.state === "open"){
				return true;
			}
		}
	},

});
