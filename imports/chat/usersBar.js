import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Rooms } from '../../imports/collections/rooms.js';
import './usersBar.html';

Template.UsersBar.onCreated(function(){
  this.currentChatUsers = new ReactiveVar;
  this.autorun(()=> {
  	if(!Meteor.user().isChat && !Session.get('closingChat')){
  		Meteor.call('users.isChatT');
  	}
    if(Session.get('currentChat')){
      this.room = Rooms.findOne(Session.get('currentChat'));
      if(this.room){
        this.currentChatUsers.set(this.room.users);
      }
    }
  });
});

Template.UsersBar.onDestroyed(function(){
  Meteor.call('users.isChatF');
});

Template.UsersBar.helpers({

  onlineUsers: ()=>{
    if(Template.instance().currentChatUsers.get()){
      return Meteor.users.find({isChat: true, _id: {$in: Template.instance().currentChatUsers.get()}});
    }
  }

});

Template.OnlineUser.helpers({

  mathFloor: (rating)=>{
    return Math.floor(rating);
  }

});