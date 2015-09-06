module.exports = function(installation) {

	installation.afterRemote('create', function (ctx, inst, next) {

		var where = {
			deviceToken: inst.deviceToken,
			id: {
				neq: inst.id
			}
		};

		installation.destroyAll(where, function(err, info) {
			if (err) {
				console.log("err in installations.destroyAll");
			}
		});
	});
};