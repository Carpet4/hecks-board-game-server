import { Games } from '../../imports/collections/games.js';
import { Messages } from '../../imports/collections/messages.js';
import { Template } from 'meteor/templating';

import './game.html';

export const blueimg = new Image();
export const redimg = new Image();
export const blackimg = new Image();
export const blues = new Image();
export const reds = new Image();
export const stonePlacement = new Audio();
export const countdown = new Audio();


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

  countdown.src = "/countdown.mp3";
  stonePlacement.src = "/stonePlacement.mp3";//need to make sure this was loaded somehow

  blueimg.src = "/hexblue.png";

  blueimg.onload = ()=> {
      this.imageLoadCheck.set(this.imageLoadCheck.get() + 1);
  };

  redimg.src = "/hexred.png";

  redimg.onload = ()=> {
      this.imageLoadCheck.set(this.imageLoadCheck.get() + 1);
  };

  blackimg.src = "/hexblack.png";

  blackimg.onload = ()=> {
      this.imageLoadCheck.set(this.imageLoadCheck.get() + 1);
  };

  blues.src = "/bluesh.png";

  blues.onload = ()=> {
      this.imageLoadCheck.set(this.imageLoadCheck.get() + 1);
  };

  reds.src = "/redsh.png";

  reds.onload = ()=> {
      this.imageLoadCheck.set(this.imageLoadCheck.get() + 1);
  };

  

});