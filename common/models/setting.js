module.exports = function(Setting) {
	Setting.disableRemoteMethod('find', true);
	Setting.disableRemoteMethod('exists', true);
	Setting.disableRemoteMethod('count', true);
	Setting.disableRemoteMethod('updateAll', true);
};
