var log = require('debug')('rest');
var feature = require('../lib/features.js');

module.exports = function(app) {

  /**
   * Check error and build generic http response for a single object.
   *
   * @param res
   * @param err
   * @param data
   */
  function singleResponse(res, err, data) {
    if (err) {
      res.send(500, err);
    } else {
      res.send(data);
    }
  }

  app.get('/', function(req, res) {
    res.render('index', { title: 'fgis-core' });
  });

  app.get('/feature/fire', function(req, res) {
    feature.allFires(req.db, singleResponse.bind(this, res));
  });
  app.get('/feature/fire/:id', function(req, res) {
    feature.getFire(req.db, req.params.id, singleResponse.bind(this, res));
  });
  app.post('/feature/fire', function(req, res) {
    feature.addFire(req.body, req.db, function(err, featureId) {
      if (err) {
        res.send(500, err);
      } else {
        res.send(201, { id: featureId });
      }
    });
  });
  app.delete('/feature/fire/:id', function(req, res) {
    log(req.method, req.url);
    feature.deleteFire(req.db, req.params.id, function(err, fire) {
      if (err) {
        res.send(500, err);
      } else {
        res.send();
      }
    });
  });

  var defaultResponse = function(res) {
    return function(err, data) {
      if (err) {
        res.send(500, err);
      } else {
        res.send(data);
      }
    }
  }
  var defaultAddResponse = function(res) {
    return function(err, featureId) {
      if (err) {
        res.send(500, err);
      } else {
        res.send(201, { id: featureId });
      }
    }
  }
  var defaultDeleteResponse = function(res) {
    return function(err, featureId) {
      if (err) {
        res.send(500, err);
      } else {
        res.send();
      }
    }
  }

  app.get('/feature/location', function(req, res) {
    feature.allLocations(req.db, defaultResponse(res));
  });
  app.get('/feature/location/:id', function(req, res) {
    feature.getLocation(req.db, req.params.id, defaultResponse(res));
  });
  app.post('/feature/location', function(req, res) {
    feature.addLocation(req.body, req.db, defaultAddResponse(res));
  });
  app.delete('/feature/location/:id', function(req, res) {
    feature.deleteLocation(req.db, req.params.id, defaultDeleteResponse(res));
  });

  app.get('/feature', function(req, res) {
    feature.all(req.db, defaultResponse(res));
  });

  //TODO: '/feature/:type/:id' etc

};
