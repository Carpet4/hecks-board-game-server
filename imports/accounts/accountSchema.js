import { Rooms } from '../../imports/collections/rooms.js';


Accounts.onCreateUser((options, user) => {
 
  user.rating = 800;
  user.isChat = 0;
  user.about = "";
  user.activeGames = [];
  user.lastRead = 0;
  if(Rooms.findOne({name: "English"})){
  	roomId = Rooms.findOne({name: "English"})._id;
  	user.chatRooms = [roomId];
	Rooms.update(roomId, {$push: {users: user._id}})
  }
  else
  	user.chatRooms = [];

  return user;
});