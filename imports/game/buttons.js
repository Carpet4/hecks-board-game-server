
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './buttons.html';

Template.Buttons.events({

	'click .resign'(event, instance) {
      Meteor.call('games.resign', FlowRouter.getParam('id'));
    },

    'click .pass'(event, instance) {
      Meteor.call('games.pass', FlowRouter.getParam('id'));
    }
});