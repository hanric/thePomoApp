module.exports = function(Session) {

	Session.disableRemoteMethod('find', true);
	Session.disableRemoteMethod('exists', true);
	Session.disableRemoteMethod('count', true);
	Session.disableRemoteMethod('updateAll', true);
	Session.disableRemoteMethod('findOne', true);

	var utils = require('../../server/utils');

	Session.afterRemote('create', function(ctx, session, next) {
		utils.notifySession(Session, session, "new");
		next();
	});

	Session.afterRemote('update', function(ctx, session, next) {
		utils.notifySession(Session, session, "updated");
		next();
	});

	Session.beforeRemote('deleteById', function(ctx, session, next) {
		utils.notifyDeleteSession(Session, ctx.args.id);
		next();
	});
};