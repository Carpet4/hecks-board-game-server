

AccountsTemplates.removeField('email');
var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
  },
  pwd
]);

AccountsTemplates.configure({
    enablePasswordChange: true,
});