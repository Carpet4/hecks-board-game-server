import '../imports/accounts/accounts-config.js';
import '../imports/accounts/loginModal.html';
import '../imports/chat/chat.js';
import '../imports/chat/usersBar.js';
import '../imports/chat/messages.js';
import '../imports/chat/roomsBar.js';
import '../imports/chat/roomPage.js';
import '../imports/play/play.js';
import '../imports/layouts/homeLayout.html';
import '../imports/layouts/mainLayout.js';
import '../imports/partials/header.js';
import '../imports/partials/messanger.js';
import '../imports/partials/sideNav.html';
import '../imports/game/pvp/pvp.js';
import '../imports/game/pvb/pvb.js';
import '../imports/game/gamePanel.js';
import '../imports/game/pvp/pvpCanvas.js';
import '../imports/game/pvb/pvbCanvas.js';
import '../imports/game/pvb/pvbPanel.js';
import '../imports/game/buttons.js';
import '../imports/watch/watch.js';
import '../imports/game/gameChat.js';
import '../imports/profile/profile.js';
import '../imports/userButton/userButton.js';
import '../imports/login/login.js';
import '../imports/router/routes.js';
import '../imports/about/about.html';
import '../imports/top100/top100.js';

Meteor.startup(function(){

  $(window).bind('beforeunload', function(event) {
  	event.returnValue = null;
  	if(event.target.location.pathname === '/chat'){
      	closingWindow();
      }
  });

  UI.registerHelper('scrollDown', function(){
      var out = Template.instance().messagesContainer;
        if(out){
        var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 30;
        if(isScrolledToBottom){
          setTimeout(function(){//otherwise it runs before DOM is actually updated
              out.scrollTop = out.scrollHeight - out.clientHeight;
          }, 10);   
          
        }
      }
  });

  UI.registerHelper('timeToMinutes', function(time){
      time = new Date(time);
      return (pad2(time.getHours()) + ":" + pad2(time.getMinutes()));
  });

  UI.registerHelper('writterCursor', function(name){
      return Meteor.users.find({username: name});
  });

  UI.registerHelper('idWritterCursor', function(id){
      return Meteor.users.find(id);
  });

  UI.registerHelper('mathFloor', function(num){
      return Math.floor(num);
  });

  if(!String.linkify) {
    String.prototype.linkify = function() {

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

        return this
            .replace(urlPattern, '<a href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
    };
  }

});

var closingWindow = function(){
    if(Meteor.userId()){
      Session.set('closingChat', true);
    	Meteor.call('users.isChatF');
	}
};

var pad2 = function(number) {
  return (number < 10 ? '0' : '') + number;
};

Tracker.autorun(function () {
    if (Meteor.userId()) {
        try {
            UserStatus.startMonitor({
            threshold: 30000,
            interval: 1000,
            idleOnBlur: true
            });
        } catch(err) {
           console.log(err);
        }
    } else {
        UserStatus.stopMonitor();
    }
});