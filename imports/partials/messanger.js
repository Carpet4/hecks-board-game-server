import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Rooms } from '../../imports/collections/rooms.js';
import { Messages } from '../../imports/collections/messages.js';

var msgSound = new Audio();
msgSound.src = "/msgSound.mp3";
import './messanger.html';

export const MessangerWindows = new Meteor.Collection(null);

Template.Messanger.onCreated(function(){
	
	this.subscribe('messangerRooms');

	var lastRead = Meteor.user().lastRead.messanger;
	if(lastRead === Infinity){
		lastRead = Date.now();
	}
	else{
		setTimeout(function(){
			if(Meteor.user().lastRead.messanger < Infinity){
				Meteor.call('users.infiniteLastReadM');
			}
		}, 4000);
		
	}
	this.messangerObserver = Rooms.find({type: "messanger", users: Meteor.userId()}).observe({
		added: function(doc){
			if(doc.lastMessage > lastRead){
				var users = doc.users;
				if(users[0] === Meteor.userId()){
					this.chatee = users[1];
				}
				else{
					this.chatee = users[0];
				}
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
				var users = doc.users;
				if(users[0] === Meteor.userId()){
					this.chatee = users[1];
				}
				else{
					this.chatee = users[0];
				}
				MessangerWindows.insert({roomId: doc._id, state: "unRead", chatee: this.chatee});
			}
			if(Meteor.user().status.idle){
				msgSound.play();
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
	    // Prevent default browser form submit
	    event.preventDefault();
	 
	    // Get value from form element
	    const target = event.target;
	    const text = target.text.value;
	 	if(text.length > 0){
	    // Insert a message into the collection
		    Meteor.call('messages.messangerInsert', text, instance.data.roomId);
		 
		    // Clear form
		    target.text.value = '';
		}
	  },

	'click .openChatWindow'(event, instance) {
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