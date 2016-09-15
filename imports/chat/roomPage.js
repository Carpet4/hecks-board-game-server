import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Rooms } from '../../imports/collections/rooms.js';

import './roomPage.html';

Template.RoomPage.onCreated(function(){
	this.roomName = FlowRouter.getParam('name');
	this.subscribe('singleRoom', this.roomName);
	this.subscribe('users');
	this.autorun((func)=> {
		if(this.subscriptionsReady()){
			this.room = Rooms.findOne({name: this.roomName});
			this.roomId = this.room._id;
			func.stop();
			//Session.set('currentChat', this.roomId); why this???
		}
	});
});

Template.RoomPage.helpers({

	room: ()=> {
		return Rooms.findOne(Template.instance().roomId);
	},

	isOwner: ()=> {
		return !!(Rooms.findOne(Template.instance().roomId).owner === Meteor.userId());
	},

	ownerObject: (id)=> {
		return Meteor.users.findOne(id);
	},

	getUser: (id)=> {
		return Meteor.users.findOne(id);
	},

	allowedToInvite: ()=> {
		roomObject = Rooms.findOne(Template.instance().roomId);
		if(roomObject.users.indexOf(Meteor.userId()) > -1 && (roomObject.isPrivate === false || 
		roomObject.owner === Meteor.userId() || roomObject.moderators.indexOf(Meteor.userId()) > -1 || 
		roomObject.invPrivi === true)){
			return true;
		}
	},

})

Template.RoomPage.events({

  'submit .nameChange'(event, instance) {
  	event.preventDefault();
  	newName = event.target.roomName.value.toString();
  	Meteor.call('rooms.nameChange', instance.roomId, newName, function(err, result){
  		if(result){
  			FlowRouter.go('/room/' + newName);
  			document.getElementById("nameExists").innerHTML = "";
  		}
  		else{
  			event.target.roomName.value = instance.room.name;
  			document.getElementById("nameExists").innerHTML = "Exists already";
  		}
  	});
  	
  },

  'submit .aboutChange'(event, instance) {
  	event.preventDefault();
  	newAbout = event.target.roomAbout.value.toString();
  	Meteor.call('rooms.aboutChange', instance.roomId, newAbout);
  },

  'submit .privacyChange'(event, instance) {
  	event.preventDefault();
  	
  	newPrivacy = event.target.isPrivate.checked;
  	Meteor.call('rooms.privacyChange', instance.roomId, newPrivacy);
  },

  'submit .invPriviChange'(event, instance) {
  	event.preventDefault();
  	
  	newInvPrivi = event.target.invBul.checked;
  	Meteor.call('rooms.invPriviChange', instance.roomId, newInvPrivi);
  },

  'submit .inviteToRoom'(event, instance) {
  	event.preventDefault();
  	invited = event.target.invited.value;
  	if(invited){
	  	Meteor.call('rooms.invite', instance.roomId, invited);
	  	event.target.invited.value = "";
	}
  },
});