import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './pvbPanel.html';

Template.PvbPanel.onCreated(function(){
	Session.set('moveNumBool', true);
	Session.set('pvbPass', false);
	Session.set('pvbRes', false);


	this.autorun(()=>{
		var variation = Session.get('myVar');
		if(variation){
			var num = Number(variation[0]) + variation.length - 1;
			document.getElementById('moveNumber').value = num;
		}
	});	

});


Template.PvbPanel.onDestroyed(function () {
	if(this.clockWorker) {
	    this.clockWorker.terminate();
	}
	Session.set('canStartReview', false);
	Session.set('moveNumBool', true);
	Session.set('pvbPass', false);
	Session.set('pvbRes', false);
	
});

Template.PvbPanel.helpers({

  	turn: ()=> {
  		return Session.get('turn');
  	},

  	moveNumInitialValue: ()=>{
		console.log("gets here", Session.get('PVBKlength'));
		Meteor.setTimeout(function(){
			Session.set('canStartReview', true);
		}, 20);
		return Session.get('PVBKlength');
	},

});


Template.PvbPanel.events({

	'click .resign'(event, instance) {
      	Session.set('pvbRes', true);
    },

    'click .pass'(event, instance) {
      	Session.set('pvbPass', true);
    },

    'click .shareVar'(event, instance) {
    	if(Session.get('myVar'))
     		Meteor.call('messages.variationInsert', Session.get('myVar'), instance.gameId);
    },

    'submit .changeMove'(event, instance){
		event.preventDefault();
		var num = Number(event.target.num.value);
		if(num < 0){
			document.getElementById('moveNumber').value = 0;
		}
		else{
			var variation = Session.get('myVar');
			if(variation){
				if(num > variation[0] + variation.length - 1){
					document.getElementById('moveNumber').value = variation[0] + variation.length - 1;
				}
				else{
					document.getElementById('moveNumber').value = num;
				}
			}
			else{
				if(num > Session.get('PVBKlength')){
					document.getElementById('moveNumber').value = Session.get('PVBKlength');
				}
				else{
					document.getElementById('moveNumber').value = num;
				}
			}
		}
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	},

	'click .back10'(){
		var num = Number(document.getElementById('moveNumber').value);
		num -= 10;
		if(num < 0){
			document.getElementById('moveNumber').value = 0;
		}
		else{
			document.getElementById('moveNumber').value = num;
		}
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	},

	'click .back1'(){
		var num = Number(document.getElementById('moveNumber').value);
		num -= 1;
		if(num < 0){
			document.getElementById('moveNumber').value = 0;
		}
		else{
			document.getElementById('moveNumber').value = num;
		}
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	},

	'click .forward1'(event, instance){
		var num = Number(document.getElementById('moveNumber').value);
		num += 1;

		var variation = Session.get('myVar');
		if(variation){
			if(num > variation[0] + variation.length - 1){
				document.getElementById('moveNumber').value = variation[0] + variation.length - 1;
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		else{
			if(num > Session.get('PVBKlength')){
				document.getElementById('moveNumber').value = Session.get('PVBKlength');
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	},

	'click .forward10'(event, instance){
		var num = Number(document.getElementById('moveNumber').value);
		num += 10;

		var variation = Session.get('myVar');
		if(variation){
			if(num > variation[0] + variation.length - 1){
				document.getElementById('moveNumber').value = variation[0] + variation.length - 1;
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		else{
			if(num > Session.get('PVBKlength')){
				document.getElementById('moveNumber').value = Session.get('PVBKlength');
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	},
});