module.exports = function(Session) {

	Session.disableRemoteMethod('find', true);

	var utils = require('../../server/utils');

	Session.afterRemote('create', function(ctx, session, next) {
		utils.notifySession(Session, session, true);
		next();
	});

	Session.afterRemote('update', function(ctx, session, next) {
		utils.notifySession(Session, session, false);
		next();
	})
};