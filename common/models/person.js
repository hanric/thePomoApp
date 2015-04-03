module.exports = function(Person) {

	var loopback = require('loopback');
	var app = loopback();

	Person.afterRemote('prototype.__create__groups', function (ctx, group, next) {
		console.log("afterREMOTE");

		var userId = ctx.req.accessToken.userId;
		group.adminId = userId;
		next();
	});
};
