var orm = require('orm')

module.exports = function(app, nconf) {

  app.use(orm.express(nconf.get('connectionUri'), {
    define: function(db) {
      db.define('feature', {
        description: String
      , updatedAt: Number
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

function getEvents(query, callback) {
  // open db

  // read some stuff

  // if err
  // callback(err)
  // return

  // got data into results

  callback(null, '');
}
