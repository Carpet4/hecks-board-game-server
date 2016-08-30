import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

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

function dotArrayCreator(){
  tempArray = new Array();
  count = 0;
  for (i = 0; i < dots.length; i++) {
    tempArray[i] = new Array();
    for(j = 0; j< dots[0].length; j++){
      if(dots[i][j] === 0){
        tempArray[i][j] = {index: count, owner: 0, group: null};
        tempArray[i][j].neighbors = new Array();

        if(i%2 === 0){
          if (dots[i-1] && dots[i-1][j] === 0)
            tempArray[i][j].neighbors[0] = {x: i-1, y: j};
          if (dots[i+1] && dots[i+1][j-1] === 0)
            tempArray[i][j].neighbors[1] = {x: i+1, y: j-1};
          if (dots[i+1] && dots[i+1][j+1] === 0)
            tempArray[i][j].neighbors[2] = {x: i+1, y: j+1};
        }
        else{
          if (dots[i-1] && dots[i-1][j-1] === 0)
            tempArray[i][j].neighbors[0] = {x: i-1, y: j-1};
          if (dots[i-1] && dots[i-1][j+1] === 0)
            tempArray[i][j].neighbors[1] = {x: i-1, y: j+1};
          if (dots[i+1] && dots[i+1][j] === 0)
            tempArray[i][j].neighbors[2] = {x: i+1, y: j};
        }
        count ++
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
  Games.insert({
    gNum: tempNum,
    p1: player1,
    p2: player2,
    p1Time: mainT * 1000,
    p2Time: mainT * 1000,
    subT: subT,
    lastMoveTime: tempTime,
    name1: player1Name,
    name2: player2Name,
    rating1: player1Rating,
    rating2: player2Rating,
    turn: 0,
    result: false,
    passCount: 0,
    groups: new Array(),
    groupCount: 1,
    dotsData: dotArrayCreator(),
    xLength: 20,
    yLength: 19
  });
  console.log(player1 + "lalala" + player2);
  if(Meteor.isServer){
    Meteor.users.update({_id: player2}, {$push: {activeGames: tempNum}});
    Meteor.users.update({_id: player1}, {$push: {activeGames: tempNum}});
  }  
}


Meteor.methods({

  'games.timeLoss'(id){
      console.log("gets here");
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
    if (Meteor.isServer) {
      check(k, Number);
      check(m, Number);
      console.log((new Date).getTime());
      this.moveTime = (new Date).getTime();//current time
      this.game = Games.findOne(id);
      if(!this.game || !this.userId){
        return;
      }
      this.groups = this.game.groups;
      this.dotsData = this.game.dotsData;
      this.turn = this.game.turn;
      this.groupCount = this.game.groupCount;
      this.xLength = this.game.xLength;
      this.yLength = this.game.yLength;
      this.lastMoveTime = this.game.lastMoveTime;//time of last move played
      this.fischerParam = this.game.subT * 1000; // to be changed later into time setting
      if(this.dotsData[k] && this.dotsData[k][m]){
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

      this.legit = false;
      if(((this.userId === this.game.p1 && this.turn % 2 === 0) || (this.userId === this.game.p2 && this.turn % 2 !== 0)) && this.game.result === false){
        if(this.dot.owner === 0){
          for(i = 0; i < 3; i++){
            if(this.dot.neighbors[i]){
              tX = this.dot.neighbors[i].x; //neighbor's x
              tY = this.dot.neighbors[i].y; //neighbor's y
              if(this.dotsData[tX][tY].owner === 0){  
                this.legit = true;
                break;
              }
            }
          }
          if(this.legit === false){

            tempGroupData = this.groups; //data of all groups
            neighborGroups = new Array(); //array to keep index of neighbor groups
            neighborGroupCount = 0; //count of ally neighbor groups
            for(i = 0; i < 3; i++){
              if(this.dot.neighbors[i]){ //if the neighbor dot exists
                tX = this.dot.neighbors[i].x; //neighbor's x
                tY = this.dot.neighbors[i].y; //neighbor's y
                if(this.dotsData[tX][tY].owner === player){ //if the dot belongs to the player
                  if(neighborGroupCount === 0){ //if no former groups were detected
                    neighborGroups[0] = this.dotsData[tX][tY].group //places the index of the ally group
                    tempGroupData[this.dotsData[tX][tY].group].libs--; //reduces its libs by 1
                    neighborGroupCount ++; //increases the ally groups count by one
                  }
                  else{
                    matchGroup = false;
                    for (w = 0; w < neighborGroupCount; w++){ //for all ally groups detected so far
                      if(this.dotsData[tX][tY].group === neighborGroups[w]){ //if the dot belongs to that group
                        tempGroupData[neighborGroups[w]].libs--; //reduces a lib to the group
                        matchGroup = true;
                        break;
                      }
                    }
                    if(matchGroup === false){ //if dot did not belong to any detected group
                      neighborGroups[neighborGroupCount] = this.dotsData[tX][tY].group; //adds a new group index 
                      tempGroupData[this.dotsData[tX][tY].group].libs--; //reduces the group's libs by 1
                      neighborGroupCount ++; //increases the ally groups detected count
                    }
                  }
                }
              }
            }
            if(neighborGroupCount !== 0){ //if found ally groups
              for(z = 0; z < neighborGroupCount; z++){
                if(tempGroupData[neighborGroups[z]].libs > 0){ //if any of then has libs

                  this.legit = true;
                  break;
                }
              }
            }
          }
        }
      }

      if(this.legit === true){
        //time left after reducing time spent
        this.playerTime -= this.moveTime - this.lastMoveTime - this.fischerParam;
        if(this.playerTime < this.fischerParam){
          Meteor.call('games.timeLoss', id);
        }
        
        
        this.dotsData[k][m].owner = player; //sets the owner of the dot
        libs = 0;
        var tX = null; //neighbor's temp x
        var tY = null; //neighbor's temp y
        isGrouped = false;
        var tempGroup = null


        //loop for dealing with opponent's touching stones
        for(i = 0; i<3; i++){
          if(this.dot.neighbors[i]){
            tX = this.dot.neighbors[i].x; //neighbor's x
            tY = this.dot.neighbors[i].y; //neighbor's y
            if(this.dotsData[tX][tY].owner === opponent){
              this.groups[this.dotsData[tX][tY].group].libs--; //takes down a lib
              if(this.groups[this.dotsData[tX][tY].group].libs === 0){ //if no more libs
                tempGroup = this.groups[this.dotsData[tX][tY].group];
                for(o = 0; o < tempGroup.stones.length; o++){
                  this.dotsData[tempGroup.stones[o].x][tempGroup.stones[o].y].group = null; //removes data from removed stone
                  this.dotsData[tempGroup.stones[o].x][tempGroup.stones[o].y].owner = 0; //removes data from removed stone
                  for(t = 0; t < 3; t++){
                    tempNeighbor = this.dotsData[tempGroup.stones[o].x][tempGroup.stones[o].y].neighbors[t];
                    if(tempNeighbor && this.dotsData[tempNeighbor.x][tempNeighbor.y].owner === player && this.dotsData[tempNeighbor.x][tempNeighbor.y].group){
                      this.groups[this.dotsData[tempNeighbor.x][tempNeighbor.y].group].libs++; //increases lib for opponent's group
                    }
                  }
                }
              }
            }
          }
        }

        //loop to deal with emtpy spots nearby
        for(i = 0; i<3; i++){
          if(this.dot.neighbors[i]){
            tX = this.dot.neighbors[i].x; //neighbor's x
            tY = this.dot.neighbors[i].y; //neighbor's y
            if(this.dotsData[tX][tY].owner === 0){//if no owner
              libs++//add's lib
            }
          }
        }

        //loop to deal with friendly stones nearby
        for(i = 0; i<3; i++){
          if(this.dot.neighbors[i]){
            tX = this.dot.neighbors[i].x; //neighbor's x
            tY = this.dot.neighbors[i].y; //neighbor's y
            if(this.dotsData[tX][tY].owner === player){//if belongs to player
              this.groups[this.dotsData[tX][tY].group].libs--;//takes down a lib from its group
              if(isGrouped === false){//if no group yet
                isGrouped = true;
                this.dotsData[k][m].group = this.dotsData[tX][tY].group;//adds to group
                this.groups[this.dotsData[k][m].group].libs += libs;//adds stone's libs to group's
                this.groups[this.dotsData[k][m].group].stones.push({x: k, y: m});//add the stone to the group
              }

              else if(this.dotsData[k][m].group !== this.dotsData[tX][tY].group){//if grouped already
                tempGroup = this.groups[this.dotsData[tX][tY].group]; 
                this.groups[this.dotsData[k][m].group].libs += tempGroup.libs;//adds the second group's libs to the stone's libs
                this.groups[this.dotsData[k][m].group].stones.push.apply(this.groups[this.dotsData[k][m].group].stones, tempGroup.stones);//adds all stone indexes to the first group

                for(o = 0; o < tempGroup.stones.length; o++){  //for each stone in the second group
                  this.dotsData[tempGroup.stones[o].x][tempGroup.stones[o].y].group = this.dotsData[k][m].group;// changes the stone's group index to the first group
                }
              }
            }
          }
        }
       
        //creates new group if no group yet
        if(isGrouped === false){
          this.dotsData[k][m].group = this.groupCount;
          this.groups[this.groupCount] = {
            libs: libs,
            stones: [{x: k, y: m}]
          }
          this.groupCount++;
        }

        
        if(this.turn % 2 === 0){
          var modifier = {$set: {
            dotsData: this.dotsData,
            groups: this.groups,
            groupCount: this.groupCount,
            turn: this.turn + 1,
            passCount: 0,
            lastMoveTime: this.moveTime,
            p1Time: this.playerTime
          }};
        }
        else{
          var modifier = {$set: {
            dotsData: this.dotsData,
            groups: this.groups,
            groupCount: this.groupCount,
            turn: this.turn + 1,
            passCount: 0,
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
  },

  'games.pass'(gameNum) {
    this.game = Games.findOne({gNum: gameNum});
    if(this.userId && this.game && this.game.result === false){
      if((this.userId === this.game.p1 && this.game.turn % 2 === 0) || (this.userId === this.game.p2 && this.game.turn % 2 !== 0)){

        tempPassCount = this.game.passCount;
        tempTurn = this.game.turn;
        var selector = {gNum: gameNum};
        var modifier = {$set: {passCount: tempPassCount + 1, turn: tempTurn + 1}};
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
                if(this.dotsData[i][j].owner === 1){
                  this.operator = 1;
                }
                else if(this.dotsData[i][j].owner === 2){
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
      else{
        var modifier = {$set: {
          result: this.game.name1 + " wins by resignation!"
        }};
      }  

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

});