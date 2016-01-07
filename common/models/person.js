module.exports = function(Person) {
	Person.disableRemoteMethod('exists', false);
	Person.disableRemoteMethod('count', false);
	Person.disableRemoteMethod('updateAll', false);
	Person.disableRemoteMethod('resetPassword', false);
	Person.disableRemoteMethod('findOne', false);
	Person.disableRemoteMethod('confirm', false);

	Person.disableRemoteMethod('__create__groups', false);
	Person.disableRemoteMethod('__delete__groups', false);
	Person.disableRemoteMethod('__destroyById__groups', false);
	Person.disableRemoteMethod('__findById__groups', false);
	Person.disableRemoteMethod('__count__groups', false);

	Person.disableRemoteMethod('__create__settings', false);
	Person.disableRemoteMethod('__delete__settings', false);
	Person.disableRemoteMethod('__updateById__settings', false);
	Person.disableRemoteMethod('__findById__settings', false);
	Person.disableRemoteMethod('__destroyById__settings', false);
	Person.disableRemoteMethod('__count__settings', false);

	Person.disableRemoteMethod('__create__accessTokens', false);
	Person.disableRemoteMethod('__get__accessTokens', false);
	Person.disableRemoteMethod('__delete__accessTokens', false);
	Person.disableRemoteMethod('__updateById__accessTokens', false);
	Person.disableRemoteMethod('__findById__accessTokens', false);
	Person.disableRemoteMethod('__destroyById__accessTokens', false);
	Person.disableRemoteMethod('__count__accessTokens', false);

	var config = require('../../server/config');

	Person.afterRemote('prototype.__get__settings', function(ctx, settings, next) {
		var app = Person.app;
		var Settings = app.models.Setting;
		Settings.findById(config.baseSettingId, function(err, setting) {
			if (err) console.log(err);
			ctx.result.push(setting);
			next();
		});
	});
};
