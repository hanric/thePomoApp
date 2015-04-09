module.exports = function(Person) {
	Person.disableRemoteMethod('__create__groups', false);
	Person.disableRemoteMethod('__delete__groups', false);
	Person.disableRemoteMethod('__destroyById__groups', false);
	Person.disableRemoteMethod('__findById__groups', false);

	Person.disableRemoteMethod('__create__settings', false);
	Person.disableRemoteMethod('__delete__settings', false);
	Person.disableRemoteMethod('__updateById__settings', false);
	Person.disableRemoteMethod('__findById__settings', false);
	Person.disableRemoteMethod('__destroyById__settings', false);

	Person.disableRemoteMethod('__create__accessTokens', false);
	Person.disableRemoteMethod('__get__accessTokens', false);
	Person.disableRemoteMethod('__delete__accessTokens', false);
	Person.disableRemoteMethod('__updateById__accessTokens', false);
	Person.disableRemoteMethod('__findById__accessTokens', false);
	Person.disableRemoteMethod('__destroyById__accessTokens', false);
	Person.disableRemoteMethod('__count__accessTokens', false);
};
