import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Games } from './games.js';
import { beginMatch } from './games.js';
import { check } from 'meteor/check';


 //collection that holds the players waiting for a match
export const AutomatchPlayers = new Meteor.Collection('automatchPlayers');


if (Meteor.isServer) {
	Meteor.publish('automatchPlayers', function automatchPlayersPublication() {
    if(this.userId)
    	return AutomatchPlayers.find();
  });
}


Meteor.methods({

	'automatchPlayers.insert'(tempMinTime, tempMaxTime, tempMinRank, tempMaxRank){
    check(tempMaxRank, Number);
    check(tempMinRank, Number);
    check(tempMaxTime, Number);
    check(tempMinTime, Number);

    if(this.userId && !AutomatchPlayers.findOne({user: this.userId})){
      this.rating = Math.floor(Meteor.users.findOne(this.userId).rating);
      tempMinRank += this.rating;
      tempMaxRank += this.rating;
      if (Meteor.isServer) {
    	  this.opponent = AutomatchPlayers.findOne({minTime: {$lt: tempMaxTime+1}, maxTime: {$gt: tempMinTime-1}, minRank: {$lt: this.rating+1}, maxRank: {$gt: this.rating-1}, rating: {$lt: tempMaxRank+1}, rating: {$gt: tempMinRank-1}});
        if(this.opponent){

          player1 = this.userId;
          player2 = this.opponent.user;

          AutomatchPlayers.remove({
            user: player2
          });

          avarageTime = (tempMinTime + tempMaxTime + this.opponent.minTime + this.opponent.maxTime) / 4;

          if(avarageTime > tempMaxTime){
            subT = tempMaxTime;
          }
          else if(avarageTime < tempMinTime){
            subT = tempMinTime;
          }
          else if(avarageTime > this.opponent.maxTime){
            subT = this.opponent.maxTime;
          }
          else if(avarageTime < this.opponent.minTime){
            subT = this.opponent.minTime;
          }
          else{
            subT = Math.round(avarageTime / 10) * 10;
          }
          
          beginMatch(player1, player2, 180, subT);
        } 
        else{
          AutomatchPlayers.insert({
            user: this.userId,
            minTime: tempMinTime,
            maxTime: tempMaxTime,
            minRank: tempMinRank,
            maxRank: tempMaxRank,
            rating: this.rating
          });
        }
      }
    }    
	},

	'automatchPlayers.remove'(){
    if(this.userId){
  		AutomatchPlayers.remove({
        		user: this.userId
      });
    }
	}



});