var config = require('./config');

module.exports = {
	notifySession: function(Session, session, isNew) {
		var app = Session.app;
		var Notification = app.models.notification;
		var PushModel = app.models.push;
		var Members = app.models.Member;
		var Groups = app.models.Group;
		var Installations = app.models.installation;

		// Find users in the group of the session
		var filterMembers = {
			where: {
				groupId: session.groupId
			}
		};

		Members.find(filterMembers, function(err, membersIds) {
			if (err) {
				console.log("err in Members.find");
			}

			//find the deviceTokens of the users
			var arrayMemberIds = filterMemberIds(membersIds);

			var devicesFilter = {
				where: {
					userId: {
						inq: arrayMemberIds
					}
				}
			};

			Installations.find(devicesFilter, function(err, installations) {
				if (err) {
					console.log("err in Installation.find");
				}

				// just to get the group name
				var groupName;
				Groups.findById(session.groupId, function(err, group) {
					groupName = group.name;
					var message;
					if (isNew) message = config.gcmSessionNew;
					else message = config.gcmSessionUpdated;
					// Create the notification
					var note = new Notification({
						expirationInterval: 3600, // Expires 1 hour from now.
						message: message,
						data: {
							groupId: session.groupId,
							groupName: groupName,
							sessionId: session.id,
							sessionName: session.name
						}
					});

					//find the deviceIds of the users
					var arrayDeviceTokens = filterDeviceTokens(installations);

					// Notify
					// TODO check if a parse is necessary
					PushModel.notifyMany(config.appId, 'android', arrayDeviceTokens, note, function(err) {
						if (err) console.log('err in notifyMany');
					});
				});
			});
		});
	},

	notifyGroupAdded: function(Group, info) {
		var app = Group.app;
		var Notification = app.models.notification;
		var PushModel = app.models.push;
		var Installations = app.models.installation;

		Installations.findByUser(info.userId, 'android', function(err, installations) {
			if (err) {
				console.log("err in Installation.find");
			}

			var note = new Notification({
				expirationInterval: 3600, // Expires 1 hour from now.
				message: config.gcmGroupAdded,
				data: {
					groupId: info.groupId,
					groupName: info.groupName
				}
			});

			var arrayDeviceTokens = filterDeviceTokens(installations);

			PushModel.notifyMany(config.appId, 'android', arrayDeviceTokens, note, function(err) {
				if (err) console.log('err in notifyMany');
			});
		});
	}
};

var filterMemberIds = function(membersIds) {
	var arrayMemberIds = [];
	for (i = 0; i < membersIds.length; ++i) {
		arrayMemberIds.push(membersIds[i].id);
	}
	return arrayMemberIds;
}

var filterDeviceTokens = function(deviceTokens) {
	var arrayDeviceTokens = [];
	for (i = 0; i < deviceTokens.length; ++i) {
		arrayDeviceTokens.push(deviceTokens[i].deviceToken);
	}
	return arrayDeviceTokens;
}