import { Template } from 'meteor/templating';

import './pvb.html';


Template.Pvb.helpers({

  imagesReady: ()=> {
    if(Session.get('imageLoadCheck') === 5){
      return true;
    }
  }
});

Template.Pvb.onCreated(function GameOnCreated() {
  this.gameId = FlowRouter.getParam('id');
	this.subscribe('singleGame', this.gameId);
});