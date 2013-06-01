var orm = require('orm')

module.exports = function(app, nconf) {

  app.use(orm.express(nconf.get('connectionUri'), {
    //TODO: Separate ORM config, for modular use in tests
    define: function(db) {
      db.define('feature', {
        description: String
      , updatedAt: Date
      , geo: Object
      }, {
        methods: {}
      , validations: {}
      });
    }
  , error: function(err) {
      throw err;
    }
  }));

};
