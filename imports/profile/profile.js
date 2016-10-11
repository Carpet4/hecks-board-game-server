import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
//import { Messages } from '../../imports/collections/messages.js';
import { Games } from '../../imports/collections/games.js';
import './profile.html';

Template.Profile.onCreated(function(){
	this.subscribe('singleProfile', FlowRouter.getParam('username'));
  this.subscribe('playerGameList', FlowRouter.getParam('username'));
  this.changePassword = new ReactiveVar(false);
});

Template.Profile.helpers({
  singleProfile: ()=>{
      return Meteor.users.findOne({username: FlowRouter.getParam('username')});
  },

  isYou: ()=>{
  	if(Meteor.user().username === FlowRouter.getParam('username'))
  		return true;
  },

  games: (id)=>{
    return Games.find({$or: [{p1: id}, {p2: id}]}, {sort: {timeStamp: -1}, limit : 100});
  },

  changePwdHelper: ()=>{
    return Template.instance().changePassword.get();
  },

  
});

Template.SingleGameOnList.helpers({
  getResult: (result)=>{
    if(result !== false){
      return true;
    }
  }
});

Template.Profile.events({

	'submit #submitProfile'(event) { //cannot change back to empty, need to fix
  	event.preventDefault();
    event.stopPropagation();
    if(event.target.box.value.length > 0){
  	 Meteor.call('users.profileChange', event.target.box.value);
    }
  },

  'click #changePwd'(event, instance){
    instance.changePassword.set(!instance.changePassword.get());
    if(instance.changePassword.get()){
      AccountsTemplates.setState('changePwd');
    }
    else{
      AccountsTemplates.setState('hide');
    }
    return instance.changePassword.get();
  }

  /*'change #genderSelect'(event, instance) {
    if(event.target.value === "Other"){
      document.getElementById('otherGender').innerHTML='<input type="text" name="other" />';
    }
    else{
      document.getElementById('otherGender').innerHTML='';
    }
  },*/

});