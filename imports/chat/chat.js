import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Rooms } from '../../imports/collections/rooms.js';
import './chat.html';

Template.Chat.onCreated(function(){
  //export var chatRooms = new Array();
  this.subscribe('onlineUsers');
  this.subscribe('rooms');

  this.autorun(()=> {
  	if (this.subscriptionsReady()) {
  		var tempChatRooms = Rooms.find({type: "community", users: Meteor.userId()}, {fields: {_id: 1}}).fetch();

  		for(var i = 0; i < tempChatRooms.length; i++){
  			tempChatRooms[i] = tempChatRooms[i]._id;
  		}
  		Session.set('activeChats', tempChatRooms);
  	}
  	if(Session.get('activeChats')){
  		this.subscribe('communityMessages', Session.get('activeChats')); //so things get updated if quits or joins a room
  	}
  });
});