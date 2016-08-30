import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Messages } from '../../imports/collections/messages.js';
import './gameChat.html';

Template.GameChat.onCreated(function(){

  this.gameNumber = Number(FlowRouter.getParam('num'));

});

Template.GameChat.onRendered(function(){

  this.messagesContainer = document.getElementById("gameMessagesContainer");
  this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight - this.messagesContainer.clientHeight;

});


Template.GameChat.helpers({

  messages: ()=> {
    return Messages.find({type: "game", room: Template.instance().gameNumber});
  },

});

Template.GameChat.events({

  'submit .newGameMessage'(event, instance) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    console.log(instance.gameNumber);
 
    // Insert a message into the collection
    Meteor.call('messages.gameInsert', text, instance.gameNumber);
 
    // Clear form
    target.text.value = '';
  },

});