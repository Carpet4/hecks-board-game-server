import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Rooms } from '../../imports/collections/rooms.js';
import { Messages } from '../../imports/collections/messages.js';

import './messanger.html';

export const MessangerWindows = new Meteor.Collection(null);

Template.Messanger.onCreated(function(){
	
	this.subscribe('messangerRooms');
	lastRead = Meteor.user().lastRead.messanger;
	if(lastRead === Infinity){
		lastRead = (new Date).getTime();
		console.log("horray");
	}
	else{
		setTimeout(function(){
			if(Meteor.user().lastRead.messanger < Infinity){
				Meteor.call('users.infiniteLastReadM');
			}
		}, 4000);
		
	}
	messangerObserver = Rooms.find({type: "messanger", users: Meteor.userId()}).observe({
		added: function(doc){
			console.log("added here");
			if(doc.lastMessage > lastRead){
				users = doc.users;
				if(users[0] === Meteor.userId()){
					this.chatee = users[1];
				}
				else{
					this.chatee = users[0];
				}
				console.log(this.chatee + " chatee");
				MessangerWindows.insert({roomId: doc._id, state: "unRead", chatee: this.chatee});
			}
		},

		changed: function(doc){
			this.activeRoom = MessangerWindows.findOne({roomId: doc._id});
			if(this.activeRoom){
				if(this.activeRoom.state !== "open"){
					MessangerWindows.update(this.activeRoom._id, {$set: {state: "unRead"}});
				}
			}
			else{
				users = doc.users;
				if(users[0] === Meteor.userId()){
					this.chatee = users[1];
				}
				else{
					this.chatee = users[0];
				}
				console.log("gets here???");
				MessangerWindows.insert({roomId: doc._id, state: "unRead", chatee: this.chatee});
			}
		},

		removed: function(doc){
			MessangerWindows.remove({roomId: doc._id});
		}
	});		
});


Template.Messanger.helpers({

	messangerWindows: ()=>{
  		return MessangerWindows.find();
  	},

});

Template.MessangerWindow.onCreated(function(){
	this.subscribe('messangerMessages', this.data.roomId);
});

Template.MessangerWindow.helpers({
	
	isOpen: (state)=>{
	    if(state === "open"){
  			return true;
  		}
  	},

  	messangerWindows: ()=>{
  		return MessangerWindows.find();
  	},

  	isUnRead: (state)=>{
  		if(state === "unRead"){
  			return true;
  		}
  	},

  	idToName: (id)=>{
  		return Meteor.users.findOne(id).username;
  	},

});




Template.MessangerWindow.events({

	'submit .new-message'(event, instance) {
	    console.log((new Date).getTime());
	    // Prevent default browser form submit
	    event.preventDefault();
	 
	    // Get value from form element
	    const target = event.target;
	    const text = target.text.value;
	 
	    // Insert a message into the collection
	    Meteor.call('messages.messangerInsert', text, instance.data.roomId);
	 
	    // Clear form
	    target.text.value = '';
	    console.log((new Date).getTime());
	  },

	'click .openChatWindow'(event, instance) {
		console.log(event.target.value);
		MessangerWindows.update(instance.data._id, {$set: {state: "open"}});
	},

	'click .minimizeChatWindow'(event, instance) {
		MessangerWindows.update(instance.data._id, {$set: {state: "minimized"}});
	},

	'click .closeChatWindow'(event, instance) {
		MessangerWindows.remove(instance.data._id);
	},

});

Template.MsnMsgsContainer.onRendered(function(){

	this.messagesContainer = document.getElementById(this.data.roomId);
	this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight - this.messagesContainer.clientHeight;

});

Template.MsnMsgsContainer.helpers({

	messages: (id)=>{
  		return Messages.find({room: id});
  	},

});