import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Messages } from '../../imports/collections/messages.js';
import './gameChat.html';

Template.GameChat.onCreated(function(){
  this.gameId = FlowRouter.getParam('id');
  this.subscribe('gameMessages', this.gameId);
  this.autorun(() => {
    if(Session.get('isGameFinished') === true){
      this.subscribe('gameMessages', this.gameId);
    }    
  });

  

});

Template.GameChat.onRendered(function(){

  this.messagesContainer = document.getElementById("gameMessagesContainer");
  this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight - this.messagesContainer.clientHeight;

});


Template.GameChat.helpers({

  messages: ()=> {
    return Messages.find({room: Template.instance().gameId});
  },

});

Template.GameChat.events({

  'click .varButton'(event){
    var variation = Messages.findOne(event.target.value).variation;
    Session.set('globalVar', variation);
  },

  'submit .newGameMessage'(event, instance) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    if(text.length > 0){
 
      // Insert a message into the collection
      Meteor.call('messages.gameInsert', text, instance.gameId);
   
      // Clear form
      target.text.value = '';
    }
  },

});