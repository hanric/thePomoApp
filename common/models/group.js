module.exports = function(Group) {
	Group.disableRemoteMethod('find', true);
	Group.disableRemoteMethod('__create__people', false);
	Group.disableRemoteMethod('__delete__people', false);
	Group.disableRemoteMethod('__destroyById__people', false);
	Group.disableRemoteMethod('__findById__people', false);
	Group.disableRemoteMethod('__updateById__people', false);
	
	Group.disableRemoteMethod('__delete__sessions', false);
	Group.disableRemoteMethod('__create__sessions', false);
	Group.disableRemoteMethod('__updateById__sessions', false);
	Group.disableRemoteMethod('__findById__sessions', false);
	Group.disableRemoteMethod('__destroyById__sessions', false);

	Group.afterRemote('create', function (ctx, group, next) {
		var userId = ctx.req.accessToken.userId;
		group.adminId = userId;
		group.save();

		var app = Group.app;
		var Member = app.models.Member;
		Member.create({'personId': userId, 'groupId': group.id}, function (err, member) {
			if (err) console.log(err);
		});
		next();
	});
};
