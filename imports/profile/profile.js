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
  },

});


Template.Profile.events({

	'submit form'(event, instance) {
  	event.preventDefault();
    event.stopPropagation();
  	Meteor.call('users.profileChange', event.target.box.value);
  },

  /*'change #genderSelect'(event, instance) {
    if(event.target.value === "Other"){
      document.getElementById('otherGender').innerHTML='<input type="text" name="other" />';
    }
    else{
      document.getElementById('otherGender').innerHTML='';
    }
  },*/

});