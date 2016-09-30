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
export const passSound = new Audio();
export const lossSound = new Audio();
export const winSound = new Audio();


Template.Game.helpers({

  imagesReady: ()=> {
    if(Template.instance().imageLoadCheck.get() === 5){
      return true;
    }
  }

});

Template.Game.onCreated(function GameOnCreated() {
  this.imageLoadCheck = new ReactiveVar(0);
  this.gameId = FlowRouter.getParam('id');
	this.subscribe('singleGame', this.gameId); //might better place the subsciptions inside autorun?a

  countdown.src = "/countdown.mp3";
  stonePlacement.src = "/stonePlacement.mp3";//need to make sure this was loaded somehow
  passSound.src = "/pass.mp3";
  lossSound.src = "/loss.mp3";
  winSound.src = "/win.mp3";

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