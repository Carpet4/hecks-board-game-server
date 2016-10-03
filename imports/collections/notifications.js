import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Games } from './games.js';
import { AutomatchPlayers } from './automatchPlayers.js';
import { beginMatch } from './games.js';
import { check } from 'meteor/check';

export const Notifications = new Meteor.Collection('notifications');

if (Meteor.isServer) {

	Notifications.remove({
      	type: "gameInvite",
      	ranked:{$exists: false}
    });
	Meteor.publish('notifications', function notificationPublication() {
		if(this.userId)
    		return Notifications.find({$or: [{$and:[{sender: this.userId}, {type: "gameInvite"}]}, {reciever: this.userId}]});
	});
}

Meteor.methods({

	'notifications.gameInvite'(opponent, mainT, subT, isRanked){
		if(Meteor.users.findOne({username: opponent})){
			check(mainT, Number);
			check(subT, Number);
			check(isRanked, Boolean);
			Notifications.insert({
				type: "gameInvite",
				sender: this.userId,
				reciever: Meteor.users.findOne({username: opponent})._id,
				mainT: mainT,
				subT: subT,
				ranked: isRanked
			});
		}
	},

	'notifications.gameAccept'(id){
		this.notification = 
		Notifications.findOne({
			type: "gameInvite",
			_id: id,
			reciever: this.userId
		});
		if(this.notification){
			this.opponent = this.notification.sender;
			if(!Games.findOne(
        	{result: false, $or: [{p1: {$in:[this.userId, this.opponent]}}, {p2: {$in:[this.userId, this.opponent]}}]})){
        		AutomatchPlayers.remove({user: {$in:[this.userId, this.opponent]}});
        		if (Meteor.isServer) {
        			console.log("notification", Meteor.users.findOne(this.userId).username, Meteor.users.findOne(this.opponent).username);	
        		}	
				Notifications.remove(id);
				beginMatch(this.userId, this.opponent, this.notification.mainT, this.notification.subT, this.notification.ranked);
			}
		}
	},

	'notifications.gameDecline'(id){
		if(Notifications.findOne({
			type: "gameInvite",
			_id: id,
			$or: [{sender: this.userId}, {reciever: this.userId}]
		})){
			Notifications.remove(id);
		}
	},
});