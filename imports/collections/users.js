import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { AutomatchPlayers } from './automatchPlayers.js';

if (Meteor.isServer) {

	UserStatus.events.on("connectionLogout", function(fields){//when closes a tab/logsout
		if(!Meteor.users.findOne(fields.userId).status.online){//if not loggedin somewhere else
			AutomatchPlayers.remove({user: fields.userId});
			Meteor.users.update(fields.userId, {$set: {lastRead: {messanger: (new Date).getTime(), community: (new Date).getTime()}}});//change the lastread
		}
	});

	Meteor.publish('users', function () {
		if(this.userId){
		    return Meteor.users.find({}, {
		        fields: {
		            "_id": 1,
		            "username": 1,
		            "rating": 1,
		            "activeGames": 1
		        }
		    });
		}
	});

	Meteor.publish('singleProfile', function (tempUsername) {
		if(this.userId){
		    return Meteor.users.find({username: tempUsername}, {
		        fields: {
		            "_id": 1,
		            "username": 1,
		            "rating": 1,
		            "about": 1,
		            "status.online": 1,
		            "status.idle": 1
		        }
		    });
		}
	});

	//used in header
	Meteor.publish('self', function () {
		if(this.userId){
		    return Meteor.users.find(this.userId, {
		        fields: {
		            "username": 1,
		            "notifications": 1,
		            "rating": 1,
		            "status": 1,
		            "lastRead": 1,
		        }
		    });
		}
	});

	Meteor.publish('onlineUsers', function () {
		if(this.userId){
		    return Meteor.users.find({"status.online": true}, {
		        fields: {
		            "_id": 1,
		            "username": 1,
		            "rating": 1,
		            "status.online": 1,
		            "status.idle": 1,
		            "chatRooms": 1,
		            "isChat": 1
		        }
		    });
		}
	});
}

Meteor.methods({

	'users.aboutChange'(newAbout){
		if(this.userId){
			check(newAbout, String);
			Meteor.users.update(this.userId, {$set: {about: newAbout}});
		}
	},

	'users.isChatT'(){
		if(this.userId){
			Meteor.users.update(this.userId, {$set: {isChat: true}});
		}
		
	},

	'users.isChatF'(){
		if(this.userId){
			Meteor.users.update(this.userId, {$set: {isChat: false}});
		}
	},

	'users.infiniteLastReadM'(){
		if(this.userId){
			lastRead = Meteor.users.findOne(this.userId).lastRead;
			lastRead.messanger = Infinity;
			Meteor.users.update(this.userId, {$set: {lastRead: lastRead}});
		}
	},
	//changes back to number at the beginning of this file
	'users.infiniteLastReadC'(){
		if(this.userId){
			lastRead = Meteor.users.findOne(this.userId).lastRead;
			lastRead.community = Infinity;
			Meteor.users.update(this.userId, {$set: {lastRead: lastRead}});
		}
	},

});