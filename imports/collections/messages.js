import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Rooms } from './rooms.js';
import { Games } from './games.js';

 
 //collection for the chat messages
export const Messages = new Meteor.Collection('messages');

if (Meteor.isServer) {
	//deletes old messages
	/*Meteor.startup(function() {
  		Messages._ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 10 } );
	});*/


  Meteor.startup(function() {
      Meteor.setInterval(()=> {
        min = (new Date).getTime() - 3600000 * 24;
        Messages.remove({
          timeStamp: {$lt: min}
        });
      }, 10000);
  });

	Meteor.publish('communityMessages', function messagesPublication() {
    if(this.userId){
      chatRooms = Rooms.find({type: "community", users:this.userId}, {fields: {_id: 1}}).fetch();
      for(i = 0; i < chatRooms.length; i ++){
        chatRooms[i] = chatRooms[i]._id;
      }
      return Messages.find({room: {$in: chatRooms}});
    }
  });

  Meteor.publish('gameMessages', function gameMessagesPublication(num) {
    if(this.userId){
      this.game = Games.findOne({gNum: num});
      if((this.game.p1 === this.userId || this.game.p2 === this.userId) && this.game.result === false){
        return Messages.find({type: "game", room: num, owner:{$in:[this.game.p1, this.game.p2]}});
      }
      else{
        return Messages.find({type: "game", room: num});
      }
    }
  });

  Meteor.publish('messangerMessages', function messangerMessagesPublication(id) {
    if(this.userId && Rooms.findOne(id, {users: this.userId, type: "messanger"})){
      return Messages.find({room: id});
    }
  });
}

Meteor.methods({

  'messages.gameInsert'(text, num){
    check(text, String);
    if(this.userId){
      tempName = Meteor.users.findOne(this.userId).username;
      tempTime = (new Date).getTime();

      Messages.insert({
        text: text,
        room: num,
        type: "game",
        timeStamp: tempTime,
        owner: this.userId,
        username: tempName
      });
    }
  },

  'messages.messangerInsert'(text, room){
    check(text, String);
    if(this.userId){
      tempRoom = Rooms.findOne(room);
      if(tempRoom && tempRoom.users.indexOf(this.userId) > -1){
        tempName = Meteor.users.findOne(this.userId).username;
        tempTime = (new Date).getTime();

        Messages.insert({
          text: text,
          room: room,
          type: "messanger",
          timeStamp: tempTime,
          owner: this.userId,
          username: tempName
        });  
        Rooms.update(room, {$set: {lastMessage: tempTime}});
      }
    }
  },

	'messages.insert'(text, room){ //need to check if the person is in the room
    check(text, String);
    if(this.userId){
      tempRoom = Rooms.findOne(room);
      if(tempRoom && tempRoom.users.indexOf(this.userId) > -1){
        tempName = Meteor.users.findOne(this.userId).username;
        tempTime = (new Date).getTime();

    		Messages.insert({
          text: text,
          room: room,
          type: "public",
      		timeStamp: tempTime,
    		  owner: this.userId,
      		username: tempName
        });

        Rooms.update(room, {$set: {lastMessage: tempTime}});
        console.log((new Date).getTime());
      }
    }
	}
});