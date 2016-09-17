import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Messages } from '../../imports/collections/messages.js';
import './messages.html';


Template.Messages.onCreated(function(){
  
  this.subscribe('messages');

});

Template.Messages.onRendered(function(){

  this.messagesContainer = document.getElementById("messagesContainer");
  this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight - this.messagesContainer.clientHeight;

});


Template.Messages.helpers({

  messages: ()=> {
    return Messages.find({room: Session.get('currentChat')});
  },

});

Template.CommunityMessage.helpers({

  writter: (name)=> {
    console.log(Meteor.users.findOne({username: name}));
    return Meteor.users.find({username: name});
  }

});

Template.Messages.events({
  'submit .new-message'(event) {
    console.log((new Date).getTime());
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    if(text.length > 0){
 
      // Insert a message into the collection
      Meteor.call('messages.insert', text, Session.get('currentChat'));
   
      // Clear form
      target.text.value = '';
      console.log((new Date).getTime());
    }
  },
});