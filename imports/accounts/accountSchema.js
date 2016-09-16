import { Rooms } from '../../imports/collections/rooms.js';


Accounts.onCreateUser((options, user) => {
 
  user.rating = 800;
  user.isChat = 0;
  user.profile = {};
  user.activeGames = [];
  user.lastRead = 0;
  if(Rooms.findOne({name: "Main"})){
  	roomId = Rooms.findOne({name: "Main"})._id;
	  Rooms.update(roomId, {$push: {users: user._id}})
  }

  return user;
});