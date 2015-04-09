module.exports = function(Session) {
	Session.disableRemoteMethod('find', true);
};
