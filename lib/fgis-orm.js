var orm = require('orm')

function defineSchema(db, models) {
  // feature which needs to be stored with geographic coordinates.
  models.feature = db.define('feature', {
      type: String
    , description: String
    , updatedAt: Date
    , geo: Object
    }
  );
  // optional array of properties that can be added to a feature.
  models.feature.hasMany('properties', {
    key: String
  , value: String
  });

  // sync the db structure to the model structure.
  db.sync();
}

module.exports = function(app, nconf) {

  app.use(orm.express(nconf.get('connectionUri'), {
    //TODO: Separate ORM config, for modular use in tests
    define: defineSchema, error: function (err) {
      throw err;
    }
  }));

};
