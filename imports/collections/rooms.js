import { Meteor } from 'meteor/meteor';
import { Notifications } from './notifications.js';
import { check } from 'meteor/check';

export const Rooms = new Meteor.Collection('rooms');



if (Meteor.isServer) {


	Meteor.startup(function() {
	    Meteor.setInterval(()=> {
	        var min = Date.now() - 1000 * 60 * 60 * 24 * 14;
	        Rooms.remove({
	          	lastMessage: {$lt: min}
	        });
	    }, 	3600000);
	});

	Meteor.publish('rooms', function roomsPublication() {
		if(this.userId)
    		return Rooms.find({type: "community", $or: [{isPrivate: false}, {users: this.userId}, {invited: this.userId}]});
  	});

  	Meteor.publish('singleRoom', function singleRoomPublication(tempName) {
  		var room = Rooms.findOne({type: "community", name: tempName});
  		if(this.userId && room){
  			if(!room.isPrivate || room.users.indexOf(this.userId) > -1 || room.invited.indexOf(this.userId) > -1){
  				return Rooms.find({name: tempName});
  			}
  		}	
  	});

  	Meteor.publish('messangerRooms', function messangerRoomsPublication() {
  		if(this.userId)
  			return Rooms.find({type: "messanger", users: this.userId});	
  	});



}

Meteor.methods({

	'rooms.create'(tempName, tempIsPrivate){
		check(tempName, String);
		check(tempIsPrivate, Boolean);
		if(this.userId && !Rooms.findOne({name: tempName})){
			Rooms.insert({
				name: tempName,
				type: "community",
				isPrivate: tempIsPrivate,
				invPrivi: false,
				owner: this.userId,
				lastMessage: new Date().getTime(),
				invited: [],
				users: [this.userId],
				moderators: [],
				desc: ""
			});
			return true;
		}
		else{
			return false;
		}
	},

	'rooms.createMessanger'(tempId){
		if(this.userId && Meteor.users.findOne(tempId)){
			if(!Rooms.findOne({type: "messanger", users: {$all: [this.userId, tempId]}})){
				Rooms.insert({
					type: "messanger",
					lastMessage: 0,
					users: [this.userId, tempId],
				});
				return Rooms.findOne({type: "messanger", users: {$all: [this.userId, tempId]}})._id;
			}
		}
	},

	'rooms.join'(room){
		var tempRoom = Rooms.findOne(room);
		if(tempRoom && this.userId){
			if(tempRoom.users.indexOf(this.userId) === -1){
				if(tempRoom.invited.indexOf(this.userId) > -1){
					Rooms.update(room, {$push: {users: this.userId}, $pull: {invited: this.userId}});
					Notifications.remove({type: "roomInvite", reciever: this.userId, room: room});
				}
				else if(tempRoom.isPrivate === false){
					Rooms.update(room, {$push: {users: this.userId}});
				}
			}
		}
	},

	'rooms.decline'(room){
		var tempRoom = Rooms.findOne(room);
		if(this.userId && tempRoom){
			if(tempRoom.invited.indexOf(this.userId) > -1){
				Rooms.update(room, {$pull: {invited: this.userId}});
				Notifications.remove({type: "roomInvite", reciever: this.userId, room: room});
			}
		}
	},

	'rooms.leave'(room){
		var tempRoom = Rooms.findOne(room);
		if(this.userId && tempRoom){
			if(tempRoom.users.indexOf(this.userId) > -1){
				Rooms.update(room, {$pull: {users: this.userId}});
			}
		}
	},

	'rooms.nameChange'(room, tempName){
		check(tempName, String);
		if(this.userId && Rooms.findOne(room) && !Rooms.findOne({name: tempName})){
			if(Rooms.findOne(room).owner === this.userId){
				Rooms.update(room, {$set:{ name: tempName}});
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	},

	'rooms.aboutChange'(room, tempAbout){
		check(tempAbout, String);
		if(this.userId && Rooms.findOne(room)){
			if(Rooms.findOne(room).owner === this.userId){
				Rooms.update(room, {$set:{ desc: tempAbout}});
			}
		}
	},

	'rooms.privacyChange'(room, tempPrivacy){
		check(tempPrivacy, Boolean);
		if(this.userId && Rooms.findOne(room)){
			if(Rooms.findOne(room).owner === this.userId){
				Rooms.update(room, {$set:{ isPrivate: tempPrivacy}});
			}
		}
	},

	'rooms.invPriviChange'(room, tempPrivi){
		check(tempPrivi, Boolean);
		if(this.userId && Rooms.findOne(room)){
			if(Rooms.findOne(room).owner === this.userId){
				Rooms.update(room, {$set:{ invPrivi: tempPrivi}});
			}
		}
	},

	'rooms.makeMod'(room, tempId){
		var tempRoom = Rooms.findOne(room);
		if(this.userId && tempRoom){
			if(tempRoom.owner === this.userId && tempRoom.users.indexOf(tempId) > -1 && 
			tempRoom.moderators.indexOf(tempId) === -1 && tempRoom.owner !== tempId){
				Rooms.update(room, {$push:{ moderators: tempId}});
			}
		}
	},

	'rooms.disMod'(room, tempId){
		var tempRoom = Rooms.findOne(room);
		if(this.userId && tempRoom){
			if(tempRoom.owner === this.userId && tempRoom.moderators.indexOf(tempId) > -1){
				Rooms.update(room, {$pull:{ moderators: tempId}});
			}
		}
	},

	'rooms.kick'(room, tempId){
		var tempRoom = Rooms.findOne(room);
		if(this.userId && tempRoom){
			if((tempRoom.owner === this.userId || tempRoom.moderators.indexOf(this.userId) > -1) && tempRoom.users.indexOf(tempId) > -1 && 
			tempRoom.moderators.indexOf(tempId) === -1 && tempRoom.owner !== tempId){
				Rooms.update(room, {$pull:{users: tempId}});
			}
		}
	},

	'rooms.invite'(room, tempName){
		var tempRoom = Rooms.findOne(room);
		var invited = Meteor.users.findOne({username: tempName});
		if(tempRoom && invited){
			var invitedId = invited._id;
			if(tempRoom.users.indexOf(invitedId) === -1 && tempRoom.users.indexOf(this.userId) > -1 && 
			(tempRoom.isPrivate === false || tempRoom.invPrivi === true || (tempRoom.owner === this.userId || tempRoom.moderators.indexOf(this.userId) > -1))){
				Rooms.update(room, {$push:{invited: invitedId}});
				Notifications.insert({
					type: "roomInvite", 
					sender: this.userId, 
					reciever: invitedId, 
					room: room
				});
			}
		}
	},

	'rooms.cancelInvite'(room, id){
		var tempRoom = Rooms.findOne(room);
		if(this.userId && tempRoom && Meteor.users.findOne(id)){
			if(tempRoom.users.indexOf(this.userId) > -1 && 
			(tempRoom.isPrivate === false || tempRoom.invPrivi === true || (tempRoom.owner === this.userId || tempRoom.moderators.indexOf(this.userId) > -1))){
				Rooms.update(room, {$pull:{invited: id}});
				Notifications.remove({
					type: "roomInvite", 
					reciever: id, 
					room: room
				});
			}
		}
	},
});