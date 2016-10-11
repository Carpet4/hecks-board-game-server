import { Template } from 'meteor/templating';

import './pvp.html';


Template.Pvp.helpers({

  imagesReady: ()=> {
    if(Session.get('imageLoadCheck') === 5){
      return true;
    }
  }
});

Template.Pvp.onCreated(function GameOnCreated() {
  this.gameId = FlowRouter.getParam('id');
	this.subscribe('singleGame', this.gameId);
});