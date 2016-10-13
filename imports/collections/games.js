import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

 //collection that holds the players currently playing.
export const Games = new Meteor.Collection('games');
//export const Test = new Meteor.Collection('test');

if (Meteor.isServer) {
  

	Meteor.publish('playerGames', function gamesPublication() {
    if(this.userId){
      return Games.find({result: false, $or:[{p1: this.userId}, {p2: this.userId}]});
    }
  });

  Meteor.publish('playerGameList', function gamesPublication(name) {
    if(this.userId){
      return Games.find({$or:[{name1: name}, {name2: name}]});
    }
  });


	Meteor.publish('singleGame', function singleGamePublication(id) {
    if(this.userId){
    	return Games.find(id, {fields: {
          p1: 1,
          p2: 1,
          p1Time: 1,
          p2Time: 1,
          subT: 1,
          lastMove: 1,
          lastMoveTime: 1,
          name1: 1,
          name2: 1,
          rating1: 1,
          rating2: 1,
          turn: 1,
          result: 1,
          kifu: 1,
          ranked: 1,
          hc: 1,
      }});
    }
  });

  Meteor.publish('activeGames', function activeGamesPublication() {
    if(this.userId){
      return Games.find({result: false}, {
        fields: {
          "p1": 1,
          "p2": 1,
          "name1": 1,
          "name2": 1,
          "rating1": 1,
          "rating2": 1,
          "turn": 1,
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

var hexs = [
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

var dots = [
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
  var tempArray = [];
  for (var i = 0; i < dots.length; i++) {
    tempArray[i] = [];
    for(var j = 0; j< dots[0].length; j++){
      if(dots[i][j] === 0){
        tempArray[i][j] = 0;
      }
    }
  }
  return tempArray;
};

export function beginMatch(player1, player2, mainT, subT, ranked){
  var randomizer = Math.random();
  if(randomizer > 0.5){
    var tempPlayer = player1;
    player1 = player2;
    player2 = tempPlayer;
  }
  var player1Rating = Meteor.users.findOne(player1).rating;
  var player1Name = Meteor.users.findOne(player1).username;
  var player2Rating = Meteor.users.findOne(player2).rating;
  var player2Name = Meteor.users.findOne(player2).username;
  var tempTime = Date.now();
  var kifu = [];
  if(!Games.findOne(
  {result: false, $or: [{p1: {$in:[player1, player2]}}, {p2: {$in:[player1, player2]}}]})){
    Games.insert({
      p1: player1,
      p2: player2,
      p1Time: mainT * 1000,
      p2Time: mainT * 1000,
      subT: subT,
      lastMove: false,
      lastMoveTime: tempTime,
      timeStamp: tempTime,
      name1: player1Name,
      name2: player2Name,
      rating1: player1Rating,
      rating2: player2Rating,
      turn: 0,
      result: false,
      passCount: 0,
      kifu: kifu,
      dotsData: dotArrayCreator(),
      ranked: ranked,
      hc: false,
    });
  }
}



var opponentHasLibs = (y, x, playah, game)=>{
  var dotsData = game.dotsData;
  if(dotsData[y] && dotsData[y][x] && dotsData[y][x] === playah){
    if(!hasLibs(y, x, playah, game)){
      stoneRemover(y, x, playah, dotsData);
    }
  }
};

var stoneRemover = (y, x, playah, dotsData)=>{
  if(dotsData[y] && dotsData[y][x] === playah){
    dotsData[y][x] = 0;
    if(y%2 === 0){
      stoneRemover(y-1, x, playah, dotsData);
      stoneRemover(y+1, x-1, playah, dotsData);
      stoneRemover(y+1, x+1, playah, dotsData);
    }
    else{
      stoneRemover(y-1, x-1, playah, dotsData);
      stoneRemover(y-1, x+1, playah, dotsData);
      stoneRemover(y+1, x, playah, dotsData);
    }
  }
};


var hasLibs = (y, x, playah, game)=>{
  var libsCheckArray = new Array(dots.length);
  for(var i=0; i < dots.length; i++){
    libsCheckArray[i] = [];
  }
  var dotsData = game.dotsData;
  return libsCheck(y, x, playah, libsCheckArray, dotsData);
};

var libsCheck = (y, x, playah, libsCheckArray, dotsData)=>{
  libsCheckArray[y][x] = true;
  if(y%2 === 0)
    return (stoneCheck(y-1, x, playah, libsCheckArray, dotsData) || stoneCheck(y+1, x-1, playah, libsCheckArray, dotsData) || stoneCheck(y+1, x+1, playah, libsCheckArray, dotsData));     
  else
    return (stoneCheck(y-1, x-1, playah, libsCheckArray, dotsData) || stoneCheck(y-1, x+1, playah, libsCheckArray, dotsData) || stoneCheck(y+1, x, playah, libsCheckArray, dotsData));
};

var stoneCheck = (y, x, playah, libsCheckArray, dotsData)=>{
  if(dotsData[y] && dotsData[y][x] !== undefined){
    if(!libsCheckArray[y][x] && dotsData[y][x] === 0){
      return true;
    }
    else if(!libsCheckArray[y][x] && dotsData[y][x] === playah){
      return libsCheck(y, x, playah, libsCheckArray, dotsData);
    }
    else
      return false;           
  }
};




Meteor.methods({

  'games.timeLoss'(id){
    var moveTime = Date.now();//current time
    var game = Games.findOne(id);
    if(game && !game.result){
      var turn = game.turn;
      var lastMoveTime = game.lastMoveTime;//time of last move played
      var modifier, playerTime;
      //time left for the player
      if(turn % 2 === 0){
        playerTime = game.p1Time;
        modifier = {$set: {
          result: "G+T",
          p1Time: 0
        }};
      }
      else{
        playerTime = game.p2Time;
        modifier = {$set: {
          result: "S+T",
          p2Time: 0
        }};
      }

      //time left after reducing time spent
      playerTime -= moveTime - lastMoveTime;
      if(playerTime <= 0){


        Games.update(id, modifier);

        //rating adjustment
        if (Meteor.isServer && game.ranked) {
          if(turn > 3){
            var Qa = game.rating1;
            var Qb = game.rating2;
            var ratingOperator;
            if(turn % 2 !== 0){
              ratingOperator = 40 * (Math.pow(10 , Qb/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa += ratingOperator;
              Qb -= ratingOperator;
            }

            else{
              ratingOperator = 40 * (Math.pow(10 , Qa/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa -= ratingOperator;
              Qb += ratingOperator;
            }


            Meteor.users.update(game.p1, {$set: {rating: Qa}});

            Meteor.users.update(game.p2, {$set: {rating: Qb}});
          }
        }
      } 
    }
  },
  


  'games.makeTurn'(k, m ,id){

    if(Meteor.isServer) {
      check(k, Number);
      check(m, Number);
      var moveTime = Date.now();//current time
      var game = Games.findOne(id);
      if(!game || !this.userId){
        return;
      }
      var dotsData = game.dotsData;
      var turn = game.turn;
      var kifu = game.kifu;
      var lastMoveTime = game.lastMoveTime;//time of last move played
      var fischerParam = game.subT * 1000; // to be changed later into time setting
      var dot;
      if(dotsData[k] && dotsData[k][m] !== undefined){
        dot = dotsData[k][m];
      }
      else{
        return;
      }
      
      var oppoTime, player, opponent, playerTime;
      //time left for the player
      if(turn % 2 === 0){
        playerTime = game.p1Time;
        oppoTime = game.p2Time;
        player = 1;
        opponent = 2;
      }
      else{
        playerTime = game.p2Time;
        oppoTime = game.p1Time;
        player = 2;
        opponent = 1;
      }

      var timeOuter = oppoTime + 3000;

      Meteor.setTimeout(function(){
        Meteor.call('games.timeLoss', id);
      }, timeOuter);

      
      if(((this.userId === game.p1 && turn % 2 === 0) || (this.userId === game.p2 && turn % 2 !== 0)) && game.result === false){
        if(dot === 0 && hasLibs(k, m, player, game)){         
          dotsData[k][m] = player;
          //time left after reducing time spent
          playerTime -= moveTime - lastMoveTime - fischerParam;
          if(playerTime < fischerParam){
            Meteor.call('games.timeLoss', id); //need to see if requires to break from method if this is true
            return;
          }
          
          var moveString = m.toString(36) + k.toString(36);
          kifu[kifu.length] = moveString;
          var lastMove = moveString;

          //dealing with opponent's touching stones

          if(k%2 === 0){
            opponentHasLibs(k-1, m, opponent, game);
            opponentHasLibs(k+1, m-1, opponent, game);
            opponentHasLibs(k+1, m+1, opponent, game);
          }
          else{
            opponentHasLibs(k-1, m-1, opponent, game);
            opponentHasLibs(k-1, m+1, opponent, game);
            opponentHasLibs(k+1, m, opponent, game);
          }




          var modifier;
          if(turn % 2 === 0){
            modifier = {$set: {
              dotsData: dotsData,
              turn: turn + 1,
              kifu: kifu,
              passCount: 0,
              lastMove: lastMove,
              lastMoveTime: moveTime,
              p1Time: playerTime
            }};
          }
          else{
            modifier = {$set: {
              dotsData: dotsData,
              turn: turn + 1,
              kifu: kifu,
              passCount: 0,
              lastMove: lastMove,
              lastMoveTime: moveTime,
              p2Time: playerTime
            }};
          }

          //Test.insert({n: this.turn + 1});
          Games.update(id, modifier);
        }
      }
    }
  },

  'games.pass'(id) {
    var game = Games.findOne(id); 
    if(this.userId && game && game.result === false){
      var turn = game.turn;
      var kifu = game.kifu;
      if((this.userId === game.p1 && turn % 2 === 0) || (this.userId === game.p2 && turn % 2 !== 0)){
        var playerTime;
        if(turn % 2 === 0){
          playerTime = game.p1Time;
        }
        else{
          playerTime = game.p2Time;
        }

        var tempPassCount = game.passCount;
        var moveTime = Date.now();
        var lastMoveTime = game.lastMoveTime;
        var fischerParam = game.subT * 1000;
        
        playerTime -= moveTime - lastMoveTime - fischerParam;
        if(playerTime < fischerParam){
          Meteor.call('games.timeLoss', game._id); //need to consider breaking out of method when reachign here
          return;
        }
        
        kifu[kifu.length] = "pass";
        
        var modifier;
        if(game.passCount === 1){

          //tells the loop which hexs are legit


          //holds the hexs values while looping
          var hexsData = [
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

                      
          var dotsData = game.dotsData;

          //changes values of hexagons
          var changeValues = function(y, x, operator){
            if(hexs[y] && hexs[y][x] === 0){
              hexsData[y][x] += operator;
            }
          };

          //searching for stones
          var i, j, operator;
          for(i = 0; i < dots.length; i++){
            for(j = 0; j < dots[0].length; j++){
              if(dots[i][j] === 0){
                //find the owner
                if(dotsData[i][j] === 1){
                  operator = 1;
                }
                else if(dotsData[i][j] === 2){
                  operator = -1;
                }
                else{
                  continue;
                }
                //finds nearby hexagons and updates values
                if(i % 2 === 0){
                  changeValues((i - 2) / 2, j - 2, operator);
                  changeValues((i - 2) / 2, j, operator);
                  changeValues(i / 2, j - 1, operator);
                }
                else{
                  changeValues((i - 3) / 2, j - 1, operator);
                  changeValues((i - 1) / 2, j - 2, operator);
                  changeValues((i - 1) / 2, j, operator);
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
                if(hexsData[i][j] > 0){
                  p1Points ++;
                }
                if(hexsData[i][j] < 0){
                  p2Points ++;
                }
              }
            }
          }
          var combinedPoints = p1Points - p2Points - 1.5;

          if (Meteor.isServer) {
            
            //rating of players
            var Qa = game.rating1;
            var Qb = game.rating2;
            var ratingOperator, endText;

            //finds the amount of rating to change and changes it for both players
            if(combinedPoints > 0){
              endText = "S+" + combinedPoints;
              ratingOperator = 40 * (Math.pow(10 , Qb/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa += ratingOperator;
              Qb -= ratingOperator;
            }
            else{
              endText = "G+" + Math.abs(combinedPoints);
              ratingOperator = 40 * (Math.pow(10 , Qa/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa -= ratingOperator;
              Qb += ratingOperator;
            }
            if(turn % 2 === 0){
              modifier = {$set: {
                passCount: tempPassCount + 1, 
                turn: turn + 1,
                kifu: kifu, 
                lastMove: "pass",
                lastMoveTime: moveTime,
                p1Time: playerTime,
                result: endText
              }};
            }
            else{
              modifier = {$set: {
                passCount: tempPassCount + 1, 
                turn: turn + 1,
                kifu: kifu,  
                lastMove: "pass",
                lastMoveTime: moveTime,
                p2Time: playerTime,
                result: endText
              }};
            }

            //updates games collection with new result
            Games.update(id, modifier);

            if(turn > 2 && game.ranked){
              Meteor.users.update(game.p1, {$set: {rating: Qa}});

              Meteor.users.update(game.p2, {$set: {rating: Qb}});
            }
          }
        }
        else{
          if(turn % 2 === 0){
            modifier = {$set: {
              passCount: tempPassCount + 1, 
              turn: turn + 1,
              kifu: kifu, 
              lastMove: "pass",
              lastMoveTime: moveTime,
              p1Time: playerTime
            }};
          }
          else{
            modifier = {$set: {
              passCount: tempPassCount + 1, 
              turn: turn + 1,
              kifu: kifu,  
              lastMove: "pass",
              lastMoveTime: moveTime,
              p2Time: playerTime
            }};
          }
          Games.update(id, modifier);
        }
      }
    }
  },

  'games.resign'(id){
    var game = Games.findOne(id);
    if(game && !game.result && (this.userId === game.p1 || game.p2)){
      var modifier;
      if(game.p1 === this.userId){
      modifier = {$set: {
          result: "G+R"
        }};
      }
      else if(game.p2 === this.userId){
        modifier = {$set: {
          result: "S+R"
        }};
      }

      if(modifier){  
        Games.update(id, modifier);

        if (Meteor.isServer && game.ranked) {
          if(game.turn > 3){
            var Qa = game.rating1;
            var Qb = game.rating2;
            var ratingOperator;

            if(game.p2 === this.userId){
              ratingOperator = 40 * (Math.pow(10 , Qb/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa += ratingOperator;
              Qb -= ratingOperator;
            }

            else{
              ratingOperator = 40 * (Math.pow(10 , Qa/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa -= ratingOperator;
              Qb += ratingOperator;
            }

            Meteor.users.update(game.p1, {
              $set: {rating: Qa}});

            Meteor.users.update(game.p2, {
              $set: {rating: Qb}});
          }
        }
      }
    }
  }
});