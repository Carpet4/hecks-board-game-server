import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Rooms } from '../../imports/collections/rooms.js';
import './roomsBar.html';

//need to fix everything marked as read when going back to chat


Template.RoomsBar.onCreated(function(){
	this.newRoom = new ReactiveVar(false);
	CommunityChats = new Meteor.Collection(null);
	Session.set('currentChat', false);

	var lastRead = Session.get('communityLastRead');
	if(!lastRead){
		lastRead = Meteor.user().lastRead.community;
		if(lastRead === Infinity){
			lastRead = Date.now();
		}
		else{
			setTimeout(function(){
				if(Meteor.user().lastRead.community < Infinity){
					Meteor.call('users.infiniteLastReadC');
				}
			}, 5000);		
		}
	}

	CommunityChatsObserver = Rooms.find({type: "community", users: Meteor.userId()},{ fields: {"id": 1, "lastMessage": 1}}).observe({
		added: function(doc){
			if(Session.get('currentChat') === false){
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

Template.RoomsBar.onDestroyed(function(){
	Session.set('communityLastRead', (new Date).getTime());
})

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
	'submit form'(event, instance){
		event.preventDefault();
		var name = event.target.roomName.value;
		var isPrivate = event.target.isPrivate.checked;
		if(name.length > 0)
			Meteor.call('rooms.create', name, isPrivate, function(err, result){
				if(result){
					event.target.roomName.value = "";
					event.target.isPrivate.checked = false;
					document.getElementById("nameExists2").innerHTML = "";
					instance.newRoom.set(false);
				}
				else{
					event.target.roomName.value = "";
					if(isPrivate){
						event.target.isPrivate.checked = true;
					}
					document.getElementById("nameExists2").innerHTML = "Exists already";
				}
			});
		event.target.roomName.value = "";
		event.target.isPrivate.checked = false;
	},

	'click .newRoom'(event, instance){
		instance.newRoom.set(!instance.newRoom.get());
	},

	'click .activeRoom'(event){
		var roomId = event.target.value;
		CommunityChats.update({state: "open"}, {$set: {state: "read"}})
		CommunityChats.update({roomId: roomId}, {$set: {state: "open"}})

		Session.set('currentChat', roomId);
	},

	'click .avaRoom'(event, instance){
		FlowRouter.go('/room/' + event.target.value);
	}
});

Template.ActiveRoomOnList.events({
	'click .info'(event){
		FlowRouter.go('/room/' + event.target.value);
	},

	'click .leaveRoom'(event){
		Meteor.call('rooms.leave', event.target.value);
	},
});

Template.AvaRoomOnList.events({
	'click .info'(event){
		FlowRouter.go('/room/' + event.target.value);
	},

	'click .join'(event){
		Meteor.call('rooms.join', event.target.value);
	},
});

Template.ActiveRoomOnList.helpers({

	isUnRead: (id)=> {
		var room = CommunityChats.findOne({roomId: id});
		if(room){
			if(room.state === "unRead"){
				return true;
			}
		}
	},

	isOpen: (id)=> {
		var room = CommunityChats.findOne({roomId: id});
		if(room){
			if(room.state === "open"){
				return true;
			}
		}
	},

});
