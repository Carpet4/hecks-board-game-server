import { Games } from '../../imports/collections/games.js';
import { Messages } from '../../imports/collections/messages.js';
import { Template } from 'meteor/templating';

import './game.html';

export const blueimg = new Image();
export const redimg = new Image();
export const blackimg = new Image();
export const blues = new Image();
export const reds = new Image();


Template.Game.helpers({

  imagesReady: ()=> {
    if(Template.instance().imageLoadCheck.get() === 5){
      console.log(document.images.length);
      return true;
    }
  }

});

Template.Game.onCreated(function GameOnCreated() {
  this.imageLoadCheck = new ReactiveVar(0);
  this.gameNumber = Number(FlowRouter.getParam('num'));
	this.subscribe('singleGame', this.gameNumber); //might better place the subsciptions inside autorun?
  this.subscribe('gameMessages', this.gameNumber);
  //this.subscribe('test');
  this.autorun(() => {
    if(Session.get('isGameFinished') === true){
      this.subscribe('singleGame', this.gameNumber);
      this.subscribe('gameMessages', this.gameNumber);
    }    
  });

  blueimg.src = "/hexblue.png";

  blueimg.onload = ()=> {
      this.imageLoadCheck.set(this.imageLoadCheck.get() + 1);
      console.log("hey");
  };

  redimg.src = "/hexred.png";

  redimg.onload = ()=> {
      this.imageLoadCheck.set(this.imageLoadCheck.get() + 1);
      console.log("hey");
  };

  blackimg.src = "/hexblack.png";

  blackimg.onload = ()=> {
      this.imageLoadCheck.set(this.imageLoadCheck.get() + 1);
      console.log("hey");
  };

  blues.src = "/bluesh.png";

  blues.onload = ()=> {
      this.imageLoadCheck.set(this.imageLoadCheck.get() + 1);
      console.log("hey");
  };

  reds.src = "/redsh.png";

  reds.onload = ()=> {
      this.imageLoadCheck.set(this.imageLoadCheck.get() + 1);
      console.log("hey");
  };

});