import { Template } from 'meteor/templating';
import './login.html';

Template.Login.onCreated(function(){
	AccountsTemplates.setState('signIn');
})