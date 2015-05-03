module.exports = function(app) {
	var Role = app.models.Role;

	//groupMember
	Role.registerResolver('groupMember', function(role, context, cb) {
		function reject() {
			process.nextTick(function() {	
				cb(null, false);
			});
		}

		if (context.modelName !== 'Session' && context.modelName !== 'Group') {
			return reject();
		}

		// do not allow anonymous users
		var userId = context.accessToken.userId;
		if (!userId) {
			return reject();
		}

		// check if the user is a member of the Group where the session belongs to
		if (context.modelName == 'Session') {
			context.model.findById(context.modelId, function(err, session) {
				if (err || !session)
					return reject();

				var Group = app.models.Group;
				Group.findById(session.groupId, function(err, group) {
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
		} else if (context.modelName == 'Group') {
			var Member = app.models.Member;
			Member.count({
				personId: userId,
				groupId: context.modelId
			}, function(err,count) {
				if (err) {
					console.log(err);
					return cb(null, false);
				}

				cb(null, count > 0); // if count > 0, there is at least a Member that matches
			});
		}
	});

	//groupAdmin
	Role.registerResolver('groupAdmin', function(role, context, cb) {
		function reject() {
			process.nextTick(function() {
				cb(null, false);
			});
		}

		// TODO handel Session check
		// if the target model is not Group or Session
		if (context.modelName !== 'Group' && context.modelName !== 'Session') {
			return reject();
		}

		// do not allow anonymous users
		var userId = context.accessToken.userId;
		if (!userId) {
			return reject();
		}

		var Group = app.models.Group;
		if (context.modelName === 'Group') {
			var groupId = context.modelId;
			Group.findById(groupId, function(err, group) {
				if (err || !group)
					return reject();

				cb(null, group.adminId === userId);
			});
		} else if (context.modelName === 'Session') {
			if (context.method === 'create') {
				Group.findById(context.remotingContext.args.data.groupId, function(err, group) {
					if (err || !group)
						return reject();
					cb(null, group.adminId === userId);
				});
			} else {
				var sessionId = context.modelId;
				var Session = app.models.Session;
				Session.findById(sessionId, function(err, session) {
					if (err || !session)
						return reject();

					Group.findById(session.groupId, function(err, group) {
						if (err || !group)
							return reject();

						cb(null, group.adminId === userId);
					});
				});
			}
		}
		
	});
}