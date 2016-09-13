import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Games } from './games.js';
import { beginMatch } from './games.js';
import { check } from 'meteor/check';

export const Notifications = new Meteor.Collection('notifications');

if (Meteor.isServer) {
	Meteor.publish('notifications', function notificationPublication() {
		if(this.userId)
    		return Notifications.find({$or: [{$and:[{sender: this.userId}, {type: "gameInvite"}]}, {reciever: this.userId}]});
	});
}

Meteor.methods({

	'notifications.gameInvite'(opponent, mainT, subT){
		if(Meteor.users.findOne({username: opponent})){
			check(mainT, Number);
			check(subT, Number);
			Notifications.insert({
				type: "gameInvite",
				sender: this.userId,
				reciever: Meteor.users.findOne({username: opponent})._id,
				mainT: mainT,
				subT: subT
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
        	{result: false, $or: [{p1:this.userId}, {p2: this.userId}, {p1:this.opponent}, {p2: this.opponent}]})){		
				Notifications.remove(id);
				beginMatch(this.userId, this.opponent, this.notification.mainT, this.notification.subT);
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