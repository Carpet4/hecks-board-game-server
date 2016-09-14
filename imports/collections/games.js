import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Rooms } from './rooms.js';

 //collection that holds the players currently playing.
export const Games = new Meteor.Collection('games');
//export const Test = new Meteor.Collection('test');

if (Meteor.isServer) {

  /*Meteor.publish('test', function testPublication() {
    return Test.find();
  });*/

	Meteor.publish('playerGames', function gamesPublication() {
    if(this.userId){
      return Games.find({gNum: {$in: Meteor.users.findOne(this.userId).activeGames}});
    }
  });

	Meteor.publish('singleGame', function singleGamePublication(num) {
    if(this.userId){
    	return Games.find({
    		gNum: num
    	});
    }
  });

  Meteor.publish('activeGames', function activeGamesPublication() {
    if(this.userId){
      return Games.find({result: false}, {
        fields: {
          "name1": 1,
          "name2": 1,
          "rating1": 1,
          "rating2": 1,
          "turn": 1,
          "gNum": 1,
          "result": 1
        }
      });
    }
  });
}


/*hexs = [
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1]
            ];

dots =  [
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1]
        ];*/

hexs = [
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
      ];

dots = [
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],   
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
      ];

var dotArrayCreator = function(){
  tempArray = new Array();
  for (i = 0; i < dots.length; i++) {
    tempArray[i] = new Array();
    for(j = 0; j< dots[0].length; j++){
      if(dots[i][j] === 0){
        tempArray[i][j] = 0;
      }
    }
  }
  return tempArray;
}

export function beginMatch(player1, player2, mainT, subT){

  player1Rating = Meteor.users.findOne(player1).rating;
  player1Name = Meteor.users.findOne(player1).username;
  player2Rating = Meteor.users.findOne(player2).rating;
  player2Name = Meteor.users.findOne(player2).username;
  tempNum = Games.find().count(); //may be dangerous, need to test a global variable for games count perhaps;
  tempTime = (new Date).getTime();
  if(!Games.findOne(
  {result: false, $or: [{p1: {$in:[player1, player2]}}, {p2: {$in:[player1, player2]}}]})){
    Games.insert({
      gNum: tempNum,
      p1: player1,
      p2: player2,
      p1Time: mainT * 1000,
      p2Time: mainT * 1000,
      subT: subT,
      lastMove: false,
      lastMoveTime: tempTime,
      name1: player1Name,
      name2: player2Name,
      rating1: player1Rating,
      rating2: player2Rating,
      turn: 0,
      result: false,
      passCount: 0,
      dotsData: dotArrayCreator(),
      xLength: 20,
      yLength: 19
    });
  }
  if(Meteor.isServer){
    Meteor.users.update({_id: player2}, {$push: {activeGames: tempNum}});
    Meteor.users.update({_id: player1}, {$push: {activeGames: tempNum}});
  }  
}



var opponentHasLibs = (o, p, playah, game)=>{
  dotsData = game.dotsData;
  if(dotsData[o] && dotsData[o][p] && dotsData[o][p] === playah){
    if(!hasLibs(o, p, playah, game)){
      stoneRemover(o, p, playah, dotsData);
    }
  }
}

var stoneRemover = (x, y, playah, dotsData)=>{
  if(dotsData[x] && dotsData[x][y] === playah){
    dotsData[x][y] = 0;
    if(x%2 === 0){
      stoneRemover(x-1, y, playah, dotsData);
      stoneRemover(x+1, y-1, playah, dotsData);
      stoneRemover(x+1, y+1, playah, dotsData);
    }
    else{
      stoneRemover(x-1, y-1, playah, dotsData);
      stoneRemover(x-1, y+1, playah, dotsData);
      stoneRemover(x+1, y, playah, dotsData);
    }
  }
}


var hasLibs = (o, p, playah, game)=>{
  var libsCheckArray = new Array(game.xLength);
  for(i=0; i < game.xLength; i++){
    libsCheckArray[i] = new Array();
  }
  var dotsData = game.dotsData;
  return libsCheck(o, p, playah, libsCheckArray, dotsData);
}

var libsCheck = (x, y, playah, libsCheckArray, dotsData)=>{
  libsCheckArray[x][y] = true;
  if(x%2 === 0)
    return (stoneCheck(x-1, y, playah, libsCheckArray, dotsData) || stoneCheck(x+1, y-1, playah, libsCheckArray, dotsData) || stoneCheck(x+1, y+1, playah, libsCheckArray, dotsData));     
  else
    return (stoneCheck(x-1, y-1, playah, libsCheckArray, dotsData) || stoneCheck(x-1, y+1, playah, libsCheckArray, dotsData) || stoneCheck(x+1, y, playah, libsCheckArray, dotsData));
}

var stoneCheck = (i, j, playah, libsCheckArray, dotsData)=>{
  if(dotsData[i] && dotsData[i][j] !== undefined){
    if(!libsCheckArray[i][j] && dotsData[i][j] === 0){
      return true;
    }
    else if(!libsCheckArray[i][j] && dotsData[i][j] === playah){
      return libsCheck(i, j, playah, libsCheckArray, dotsData);
    }
    else
      return false;           
  }
}




Meteor.methods({

  'games.timeLoss'(id){
    console.log("gets here time");
    this.moveTime = (new Date).getTime();//current time
    this.game = Games.findOne(id);
    if(this.userId && this.game && !this.game.result){
      this.turn = this.game.turn;
      this.lastMoveTime = this.game.lastMoveTime;//time of last move played

      //time left for the player
      if(this.turn % 2 === 0){
        this.playerTime = this.game.p1Time;
        modifier = {$set: {
          result: this.game.name2 + " wins on time!"
        }};
      }
      else{
        this.playerTime = this.game.p2Time;
        modifier = {$set: {
          result: this.game.name1 + " wins on time!"
        }};
      }

      //time left after reducing time spent
      this.playerTime -= this.moveTime - this.lastMoveTime;
      if(this.playerTime <= 0){


        Games.update(id, modifier);

        //rating adjustment
        if (Meteor.isServer) {
          
          Qa = this.game.rating1;
          Qb = this.game.rating2;

          if(this.turn % 2 !== 0){
            ratingOperator = 40 * (Math.pow(10 , Qb/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

            Qa += ratingOperator;
            Qb -= ratingOperator;
          }

          else{
            ratingOperator = 40 * (Math.pow(10 , Qa/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

            Qa -= ratingOperator;
            Qb += ratingOperator;
          }


          Meteor.users.update(this.game.p1, {
            $set: {rating: Qa},
            $pull: {activeGames: this.game.gNum}
          });

          Meteor.users.update(this.game.p2, {
            $set: {rating: Qb},
            $pull: {activeGames: this.game.gNum}
          });
        }
      } 
    }
  },
  


  'games.makeTurn'(k, m ,id){

    if(Meteor.isServer) {
      check(k, Number);
      check(m, Number);
      console.log((new Date).getTime());
      this.moveTime = (new Date).getTime();//current time
      this.game = Games.findOne(id);
      if(!this.game || !this.userId){
        return;
      }
      this.dotsData = this.game.dotsData;
      this.turn = this.game.turn;
      this.xLength = this.game.xLength;
      this.yLength = this.game.yLength;
      this.lastMoveTime = this.game.lastMoveTime;//time of last move played
      this.fischerParam = this.game.subT * 1000; // to be changed later into time setting
      if(this.dotsData[k] && this.dotsData[k][m] !== undefined){
        this.dot = this.dotsData[k][m];
      }
      else{
        return
      }

      //time left for the player
      if(this.turn % 2 === 0){
        this.playerTime = this.game.p1Time;
        player = 1;
        opponent = 2;
      }
      else{
        this.playerTime = this.game.p2Time;
        player = 2;
        opponent = 1;
      }

      
      if(((this.userId === this.game.p1 && this.turn % 2 === 0) || (this.userId === this.game.p2 && this.turn % 2 !== 0)) && this.game.result === false){
        if(this.dot === 0 && hasLibs(k, m, player, this.game)){         
          this.lastMove = {x: k, y: m};
          this.dotsData[k][m] = player;
          //time left after reducing time spent
          this.playerTime -= this.moveTime - this.lastMoveTime - this.fischerParam;
          if(this.playerTime < this.fischerParam){
            Meteor.call('games.timeLoss', id);
          }
          

          //dealing with opponent's touching stones

          if(k%2 === 0){
            opponentHasLibs(k-1, m, opponent, this.game);
            opponentHasLibs(k+1, m-1, opponent, this.game);
            opponentHasLibs(k+1, m+1, opponent, this.game);
          }
          else{
            opponentHasLibs(k-1, m-1, opponent, this.game);
            opponentHasLibs(k-1, m+1, opponent, this.game);
            opponentHasLibs(k+1, m, opponent, this.game);
          }




          
          if(this.turn % 2 === 0){
            var modifier = {$set: {
              dotsData: this.dotsData,
              turn: this.turn + 1,
              passCount: 0,
              lastMove: this.lastMove,
              lastMoveTime: this.moveTime,
              p1Time: this.playerTime
            }};
          }
          else{
            var modifier = {$set: {
              dotsData: this.dotsData,
              turn: this.turn + 1,
              passCount: 0,
              lastMove: this.lastMove,
              lastMoveTime: this.moveTime,
              p2Time: this.playerTime
            }};
          }

          //Test.insert({n: this.turn + 1});
          console.log((new Date).getTime() + "this");
          Games.update(id, modifier);
          console.log((new Date).getTime() + " " + Games.findOne(id).turn);
        }
      }
    }
  },

  'games.pass'(gameNum) {
    this.game = Games.findOne({gNum: gameNum});
    if(this.userId && this.game && this.game.result === false){
      if((this.userId === this.game.p1 && this.game.turn % 2 === 0) || (this.userId === this.game.p2 && this.game.turn % 2 !== 0)){

        tempPassCount = this.game.passCount;
        tempTurn = this.game.turn;
        var selector = {gNum: gameNum};
        var modifier = {$set: {passCount: tempPassCount + 1, turn: tempTurn + 1, lastMove: false}};
        Games.update(selector, modifier);

        if(this.game.passCount === 1){

          //tells the loop which hexs are legit


          //holds the hexs values while looping
          this.hexsData = [
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                          ];

                      
          this.dotsData = this.game.dotsData;

          //changes values of hexagons
          changeValues = function(x, y, operator){
            if(hexs[x] && hexs[x][y] === 0){
              that.hexsData[x][y] += operator;
            }
          }

          //searching for stones
          that = this;
          for(i = 0; i < dots.length; i++){
            for(j = 0; j < dots[0].length; j++){
              if(dots[i][j] === 0){
                //find the owner
                if(this.dotsData[i][j] === 1){
                  this.operator = 1;
                }
                else if(this.dotsData[i][j] === 2){
                  this.operator = -1;
                }
                else{
                  continue;
                }
                //finds nearby hexagons and updates values
                if(i % 2 === 0){
                  changeValues((i - 2) / 2, j - 2, this.operator);
                  changeValues((i - 2) / 2, j, this.operator);
                  changeValues(i / 2, j - 1, this.operator);
                }
                else{
                  changeValues((i - 3) / 2, j - 1, this.operator);
                  changeValues((i - 1) / 2, j - 2, this.operator);
                  changeValues((i - 1) / 2, j, this.operator);
                }




              }
            }
          }
          var p1Points = 0;
          var p2Points = 0;

          //calculates points of each players in the end
          for(i = 0; i < hexs.length; i++){
            for(j = 0; j < hexs[0].length; j++){
              if(hexs[i][j] === 0){
                if(that.hexsData[i][j] > 0){
                  p1Points ++;
                }
                if(that.hexsData[i][j] < 0){
                  p2Points ++;
                }
              }
            }
          }
          console.log(" " + p1Points + " " + p1Points + " ")
          combinedPoints = p1Points - p2Points - 0.5;


          if (Meteor.isServer) {

            //rating of players
            Qa = this.game.rating1;
            Qb = this.game.rating2;

            //finds the amount of rating to change and changes it for both players
            if(combinedPoints > 0){
              endText = this.game.name1 + " wins by " + combinedPoints + " points!";
              ratingOperator = 40 * (Math.pow(10 , Qb/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa += ratingOperator;
              Qb -= ratingOperator;
            }
            else{
              endText = this.game.name2 + " wins by " + Math.abs(combinedPoints) + " points!";
              ratingOperator = 40 * (Math.pow(10 , Qa/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa -= ratingOperator;
              Qb += ratingOperator;
            }

            //updates users collection with new ratings
            
            Meteor.users.update(this.game.p1, {
              $set: {rating: Qa},
              $pull: {activeGames: gameNum}
            });

            Meteor.users.update(this.game.p2, {
              $set: {rating: Qb},
              $pull: {activeGames: gameNum}
            });


            //updates games collection with new result
            Games.update({gNum: gameNum}, {$set:{ result: endText}});
          }
        }

      }
    }
  },

  'games.resign'(tempNum){
    this.game = Games.findOne({gNum: tempNum});
    if(this.game && !this.game.result && (this.userId === this.game.p1 || this.game.p2)){
      var selector = {gNum: tempNum};

      if(this.game.p1 === this.userId){
        var modifier = {$set: {
          result: this.game.name2 + " wins by resignation!"
        }};
      }
      else if(this.game.p2 === this.userId){
        var modifier = {$set: {
          result: this.game.name1 + " wins by resignation!"
        }};
      }

      if(modifier){  
        Games.update(selector, modifier);

        if (Meteor.isServer) {
          
          Qa = this.game.rating1;
          Qb = this.game.rating2;

          if(this.game.p2 === this.userId){
            ratingOperator = 40 * (Math.pow(10 , Qb/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

            Qa += ratingOperator;
            Qb -= ratingOperator;
          }

          else{
            ratingOperator = 40 * (Math.pow(10 , Qa/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

            Qa -= ratingOperator;
            Qb += ratingOperator;
          }

          Meteor.users.update(this.game.p1, {
            $set: {rating: Qa},
            $pull: {activeGames: tempNum}
          });

          Meteor.users.update(this.game.p2, {
            $set: {rating: Qb},
            $pull: {activeGames: tempNum}
          });
        }
      }
    }
  }

});