import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './mainLayout.html';


Template.MainLayout.onCreated(function(){
	this.subscribe('self');
	this.subscribe('messages');
	this.subscribe('users');
});