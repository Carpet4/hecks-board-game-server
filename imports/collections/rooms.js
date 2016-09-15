import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Notifications } from './notifications.js';
import { check } from 'meteor/check';

export const Rooms = new Meteor.Collection('rooms');

if (Meteor.isServer) {

	Meteor.publish('rooms', function roomsPublication() {
		if(this.userId)
    		return Rooms.find({type: "community", $or: [{isPrivate: false}, {users: this.userId}, {invited: this.userId}]});
  	});

  	Meteor.publish('singleRoom', function singleRoomPublication(tempName) {
  		this.room = Rooms.findOne({type: "community", name: tempName});
  		if(this.userId && this.room){
  			if(!this.room.isPrivate || this.room.users.indexOf(this.userId) > -1 || this.room.invited.indexOf(this.userId) > -1){
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
		tempRoom = Rooms.findOne(room);
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
		tempRoom = Rooms.findOne(room);
		if(this.userId && tempRoom){
			if(tempRoom.invited.indexOf(this.userId) > -1){
				Rooms.update(room, {$pull: {invited: this.userId}});
				Notifications.remove({type: "roomInvite", reciever: this.userId, room: room});
			}
		}
	},

	'rooms.leave'(room){
		tempRoom = Rooms.findOne(room);
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
			return false
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
		this.room = Rooms.findOne(room);
		if(this.userId && this.room){
			if(this.room.owner === this.userId && this.room.users.indexOf(tempId) > -1 && 
			this.room.moderators.indexOf(tempId) === -1 && this.room.owner !== tempId){
				Rooms.update(room, {$push:{ moderators: tempId}});
			}
		}
	},

	'rooms.disMod'(room, tempId){
		this.room = Rooms.findOne(room);
		if(this.userId && this.room){
			if(this.room.owner === this.userId && this.room.moderators.indexOf(tempId) > -1){
				Rooms.update(room, {$pull:{ moderators: tempId}});
			}
		}
	},

	'rooms.kick'(room, tempId){
		this.room = Rooms.findOne(room);
		if(this.userId && this.room){
			if((this.room.owner === this.userId || this.room.moderators.indexOf(this.userId) > -1) && this.room.users.indexOf(tempId) > -1 && 
			this.room.moderators.indexOf(tempId) === -1 && this.room.owner !== tempId){
				Rooms.update(room, {$pull:{users: tempId}});
			}
		}
	},

	'rooms.invite'(room, tempName){
		this.room = Rooms.findOne(room);
		this.invited = Meteor.users.findOne({username: tempName});
		if(this.room && this.invited){
			this.invitedId = this.invited._id;
			if(this.room.users.indexOf(this.invitedId) === -1 && this.room.users.indexOf(this.userId) > -1 && 
			(this.room.isPrivate === false || this.room.invPrivi === true || (this.room.owner === this.userId || this.room.moderators.indexOf(this.userId) > -1))){
				Rooms.update(room, {$push:{invited: this.invitedId}});
				Notifications.insert({
					type: "roomInvite", 
					sender: this.userId, 
					reciever: this.invited._id, 
					room: room
				});
			}
		}
	},

	'rooms.cancelInvite'(room, id){
		this.room = Rooms.findOne(room);
		if(this.userId && this.room && Meteor.users.findOne(id)){
			if(this.room.users.indexOf(this.userId) > -1 && 
			(this.room.isPrivate === false || this.room.invPrivi === true || (this.room.owner === this.userId || this.room.moderators.indexOf(this.userId) > -1))){
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