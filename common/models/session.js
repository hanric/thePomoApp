module.exports = function(Session) {

	Session.disableRemoteMethod('find', true);

	Session.afterRemote('create', function(ctx, session, next) {
		var app = Session.app;
		var Notification = app.models.notification;
		var PushModel = app.models.push;
		var Members = app.models.Member;
		var Installations = app.models.installation;

		// Find users in the group of the session
		var filter = {
			fields: {
				id: true
			},
			where: {
				groupId: session.groupId
			}
		};

		Members.find(filter, function(err, membersIds) {
			if (err) {
				console.log("err in Members.find");
			}

			console.log(membersIds);

			//find the deviceTokens of the users
			var arrayMemberIds = [];
			for (i = 0; i < membersIds.length; ++i) {
				arrayMemberIds.push(membersIds[i].id);
			}
			console.log(arrayMemberIds);


			var devicesFilter = {
				fields: {
					deviceToken: true
				},
				where: {
					userId: {
						inq: arrayMemberIds
					}
				}
			};

			Installations.find(devicesFilter, function(err, deviceTokens) {
				if (err) {
					console.log("err in Installation.find");
				}

				console.log(deviceTokens);

				// Create the notification
				var note = new Notification({
					expirationInterval: 3600, // Expires 1 hour from now.
					message: 'You have a new session added'
				});

				//find the deviceIds of the users
				var arrayDeviceTokens = [];
				for (i = 0; i < deviceTokens.length; ++i) {
					arrayDeviceIds.push(deviceTokens[i].deviceToken);
				}
				console.log(arrayDeviceIds);

				// Notify
				// TODO check if a parse is necessary
				PushModel.notifyMany('thePomoAppId', 'android', devicesTokens, note, function(err) {
					console.log('pushing notification to %j', arrayDeviceTokens);
				});
			});




			/*
						// Notify by query to a set of users
						PushModel.notifyByQuery({userId: membersIds}, note, function(err) {
						   console.log('pushing notification to %j', membersIds);
						});
			*/
		});
		next();
	});
};