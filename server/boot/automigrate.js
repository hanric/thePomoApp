module.exports = function(app) {
  app.dataSources.mysqlDs.automigrate('Group', function(err) {
    if (err) throw err;

    });
  });
};