import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
//import { Messages } from '../../imports/collections/messages.js';
import './profile.html';

Template.Profile.onCreated(function(){
	this.subscribe('singleProfile', FlowRouter.getParam('username'));
});

Template.Profile.helpers({
  singleProfile: ()=>{
      return Meteor.users.findOne({username: FlowRouter.getParam('username')});
  },

  isYou: ()=>{
  	if(Meteor.user().username === FlowRouter.getParam('username'))
  		return true;
  }

});

Template.Profile.events({

	'submit .profileAboutChange'(event) {
  	event.preventDefault();
  	newAbout = event.target.profileAbout.value.toString();
  	Meteor.call('users.aboutChange', newAbout);
  },

});