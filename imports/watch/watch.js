import { Template } from 'meteor/templating';
import './watch.html';
import { Games } from '../collections/games.js';


Template.Watch.onCreated(function(){
  this.subscribe('activeGames');
});


Template.Watch.helpers({

  games: ()=> {
    return Games.find({result: false});
  }

});