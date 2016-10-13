import { Meteor } from 'meteor/meteor';
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
      var rating = Math.floor(Meteor.users.findOne(this.userId).rating);
      tempMinRank += rating;
      tempMaxRank += rating;
      if (Meteor.isServer) {
    	  var opponent = AutomatchPlayers.findOne({minTime: {$lt: tempMaxTime+1}, maxTime: {$gt: tempMinTime-1}, minRank: {$lt: rating+1}, maxRank: {$gt: rating-1}, rating: {$lt: tempMaxRank+1}, rating: {$gt: tempMinRank-1}});
        if(opponent){

          var player1 = this.userId;
          var player2 = opponent.user;

          AutomatchPlayers.remove({
            user: player2
          });
          if (Meteor.isServer) {
            console.log("automatch1", Meteor.users.findOne(player2).username);
          }
          var avarageTime = (tempMinTime + tempMaxTime + opponent.minTime + opponent.maxTime) / 4;
          var subT;
          if(avarageTime > tempMaxTime){
            subT = tempMaxTime;
          }
          else if(avarageTime < tempMinTime){
            subT = tempMinTime;
          }
          else if(avarageTime > opponent.maxTime){
            subT = opponent.maxTime;
          }
          else if(avarageTime < opponent.minTime){
            subT = opponent.minTime;
          }
          else{
            subT = Math.round(avarageTime / 10) * 10;
          }
          
          beginMatch(player1, player2, 180, subT, true);
        } 
        else{
          AutomatchPlayers.insert({
            user: this.userId,
            minTime: tempMinTime,
            maxTime: tempMaxTime,
            minRank: tempMinRank,
            maxRank: tempMaxRank,
            rating: rating
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