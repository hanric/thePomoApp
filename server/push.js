module.exports = function (app) {
  var Notification = app.models.notification;
  var Application = app.models.application;
  var PushModel = app.models.push;

  //Pre-register thePomoAPP
  var config = require('./config');

  var thePomoAPP = {
  	id: 'thePomoAPPId',
  	userId: 'pomoINC',
  	name: config.appName,
  	description: 'Pomodoro for Groups Android app',
  	pushSettings: {
  		gcm: {
  			serverApiKey: config.gcmServerApiKey
  		}
  	}
  };

  updateOrCreateApp(function (err, appModel) {
      if (err) {
        throw err;
      }
      console.log('Application id: %j', appModel.id);
    });

//--- Helper functions ---
    function updateOrCreateApp(cb) {
      Application.findOne({
          where: { id: thePomoAPP.id }
        },
        function (err, result) {
          if (err) cb(err);
          if (result) {
            console.log('Updating application: ' + result.id);
            delete thePomoAPP.id;
            result.updateAttributes(thePomoAPP, cb);
          } else {
            return registerApp(cb);
          }
        });
    }

    function registerApp(cb) {
      console.log('Registering a new Application...');
      // Hack to set the app id to a fixed value so that we don't have to change
      // the client settings
      Application.beforeSave = function (next) {
        if (this.name === thePomoAPP.name) {
          this.id = 'thePomoAPPId';
        }
        next();
      };
      Application.register(
        thePomoAPP.userId,
        thePomoAPP.name,
        {
          description: thePomoAPP.description,
          pushSettings: thePomoAPP.pushSettings
        },
        function (err, app) {
          if (err) {
            return cb(err);
          }
          return cb(null, app);
        }
      );
    }
}