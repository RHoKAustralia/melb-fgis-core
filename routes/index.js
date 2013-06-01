module.exports = function(app) {
  var localApp = app;

  function logObject(obj) {
    console.log('- logObject:', require('util').inspect(obj));
  }
  function logObject(label, obj) {
    console.log('-', label, require('util').inspect(obj));
  }
  function logRoute(request) {
    console.log(request.method, request.url);
  }

  function addFireFeature(feature, db, cb) {
    db.models.feature.create([
      {
        'description': feature.description
      , 'geo':         feature.geo
      , 'updatedAt':   new Date()
      }
    ], function(err, items) {
      if (err) {
        cb(err);
        return;
      }
      var successIds = [];
      for (var i = 0; i < items.length; i++) {
        successIds.push(items[i].id);
      };
      cb(null, successIds);
    });
  }
  function getFireFeatures(db, cb) {
    db.models.feature.find({}, function(err, fires) {
      if (err) {
        cb(err);
        return;
      }
      cb(null, fires);
    });
  }
  function getFireFeature(db, id, cb) {
    db.models.feature.find({'id': id}, function(err, fires) {
      if (err) {
        cb(err);
        return;
      }
      cb(null, fires[0]);
    });
  }

  app.get('/', function(req, res) {
    res.render('index', { title: 'fgis-core' })
  });

  app.get('/feature/fire', function(req, res) {
    getFireFeatures(req.db, function(err, fires) {
      if (err) {
        res.send(500, err);
      } else {
        res.send(fires);
      }
    });
  });

  app.get('/feature/fire/:id', function(req, res) {
    getFireFeature(req.db, req.params.id, function(err, fire) {
      if (err) {
        res.send(500, err);
      } else {
        res.send(fire);
      }
    });
  });

  app.post('/feature/fire', function(req, res) {
    addFireFeature(req.body, req.db, function(err, featureIds) {
      if (err) {
        res.send(500, err);
      } else {
        res.send(201, featureIds);
      }
    });
  });

}