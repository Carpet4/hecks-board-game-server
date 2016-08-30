
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './buttons.html';

Template.Buttons.events({

	'click .resign'(event, instance) {
      var tempNum = Number(FlowRouter.getParam('num'));
      Meteor.call('games.resign', tempNum);
    },

    'click .pass'(event, instance) {
      var tempNum = Number(FlowRouter.getParam('num'));
      Meteor.call('games.pass', tempNum);
    }
});