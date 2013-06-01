module.exports = function(app) {
  var localApp = app;

  function logObject(obj) {
    console.log('- logObject:', require('util').inspect(obj));
  }
  function logObject(label, obj) {
    console.log('-', label, require('util').inspect(obj));
  }

  function addFireFeature(feature, db, cb) {
    logObject('addFireFeature', feature);

    db.models.feature.create([
      {
        'description': feature.description
      , 'geo':         feature.geo
      , 'updatedAt':   new Date().getTime()
      }
    ], function(err, items) {
      console.log(items);
      if (err) {
        cb(err);
        return;
      }
      var successIds = [];
      for (var i = 0; i < items.length; i++) {
        console.log(items[i]);
        successIds.push(items[i].id);
      };
      cb(null, successIds);
    });
  }
  function getFireFeatures(db, cb) {
    db.models.feature.find({'type':'fire'}, function(err, fires) {
      if (err) {
        cb(err);
        return;
      }
      cb(null, fires);
    });
  }

  app.get('/', function(req, res) {
    res.render('index', { title: 'fgis-core' })
  })

  app.get('/feature/fire', function(req, res) {
    console.log('GET ' + req.url);

    getFireFeatures(req.db, function(err, fires) {
      if (err) {
        res.send(500, err);
      } else {
        res.send(fires);
      }
    });
  });

  app.post('/feature/fire', function(req, res) {
    console.log('POST ' + req.url);
    logObject('req', req);

    addFireFeature(req.body, req.db, function(err, featureIds) {
      if (err) {
        res.send(500, err);
      } else {
        res.send(201, featureIds);
      }
    });
  });

}