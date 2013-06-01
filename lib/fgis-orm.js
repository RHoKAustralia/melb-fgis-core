var orm = require('orm')

function defineSchema(db, models) {
  // feature which needs to be stored with geographic coordinates.
  models.feature = db.define('feature', {
      description: String, updatedAt: Date, geo: Object
    }
  );
  // option array of properties a feature can be tagged with.
  models.feature.hasMany("properties", {
    key: String, value: String
  });
  // sync the db structure to the model structure.
  db.sync();
}

module.exports = function (app, nconf) {

  app.use(orm.express(nconf.get('connectionUri'), {
    //TODO: Separate ORM config, for modular use in tests
    define: defineSchema, error: function (err) {
      throw err;
    }
  }));

};
