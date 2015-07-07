module.exports = function(Session) {

	Session.disableRemoteMethod('find', true);

	var utils = require('../../server/utils');

	Session.afterRemote('create', function(ctx, session, next) {
		utils.notifySession(Session, session, "new");
		next();
	});

	Session.afterRemote('update', function(ctx, session, next) {
		utils.notifySession(Session, session, "updated");
		next();
	});

	Session.afterRemote('delete', function(ctx, session, next) {
		utils.notifySession(Session, session, "deleted");
		next();
	});
};