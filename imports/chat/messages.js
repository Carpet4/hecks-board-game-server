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

Template.Messages.events({
  'submit .new-message'(event) {
    console.log((new Date).getTime());
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 
    // Insert a message into the collection
    Meteor.call('messages.insert', text, Session.get('currentChat'), function (err, id){
                      console.log((new Date).getTime() + " HELLO");
                      });
 
    // Clear form
    target.text.value = '';
    console.log((new Date).getTime());
  },
});


Template.Message.onCreated(function(){
  this.pad2 = function(number) {
  return (number < 10 ? '0' : '') + number;
  }
});

Template.Message.helpers({

  timeToMinutes: (time)=> {
    console.log((new Date).getTime());
    this.time = new Date(time);
    return (Template.instance().pad2(this.time.getHours()) + ":" + Template.instance().pad2(this.time.getMinutes()));
  }

});