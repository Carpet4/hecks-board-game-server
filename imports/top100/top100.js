import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './top100.html';

Template.Top100.helpers({
	players: ()=>{
		return Meteor.users.find({}, {sort: {rating: -1}, limit : 100});
	}
});