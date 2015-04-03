module.exports = function(app) {
	var Role = app.models.Role;

	//groupMember
	Role.registerResolver('groupMember', function(role, context, cb) {
		function reject() {
			process.nextTick(function() {	
				cb(null, false);
			});
		}

		// if the target model is not Group
		if (context.modelName !== 'Group') {
			return reject();
		}

		// do not allow anonymous users
		var userId = context.accessToken.userId;
		if (!userId) {
			return reject();
		}

		// check if there is a Member with userId and groupId
		context.model.findById(context.modelId, function(err, group) {
			if (err || !group)
				return reject();

			var Member = app.models.Member;
			Member.count({
				personId: userId,
				groupId: group.modelId
			}, function(err,count) {
				if (err) {
					console.log(err);
					return cb(null, false);
				}

				cb(null, count > 0); // if count > 0, there is at least a Member that matches
			});
		});
	});

	//groupAdmin
	Role.registerResolver('groupAdmin', function(role, context, cb) {
		function reject() {
			process.nextTick(function() {
				cb(null, false);
			});
		}

		// if the target model is not Group
		if (context.modelName !== 'Person') {
			return reject();
		}

		// do not allow anonymous users
		var userId = context.accessToken.userId;
		if (!userId) {
			return reject();
		}

		//TODO check if it's correct for other methods
		var groupId = context.remotingContext.args.fk;
		var Group = app.models.Group;
		Group.findById(groupId, function(err, group) {
			if (err || !group)
				return reject();

			cb(null, group.adminId === userId);
		});
	});
}