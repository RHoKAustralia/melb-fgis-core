var orm = require('orm')

exports = function(app, nconf) {

  // connect to db
  app.use(orm.express(nconf.get('connectionUri'), {
    define: function(db) {
      db.define('feature', {
        // fields
        description: String
      , updatedAt: Date
      , geo: Object
      }, {
        methods: {}
      , validations: {}
      });
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
