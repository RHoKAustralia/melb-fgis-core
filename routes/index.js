module.exports = function(app) {

  var localApp = app;

  function logObject(obj) {
    console.log('obj', require('util').inspect(obj));
  }

  function addFeature(feature, db, cb) {
    logObject(feature);

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

  app.get('/', function(req, res) {
    req.db.models.feature.find({'description': ''},  function(err, features) {})
    res.render('index', { title: 'fgis-core' })
  })

  app.get('/feature/fire', function(req, res) {
    console.log('GET ' + req.url);

    var features = req.db.models.feature.find({'type':'fire'});
    res.send(features);
  });

  app.post('/feature/fire', function(req, res) {
    console.log('POST ' + req.url);

    addFeature(req.body, req.db, function(error, featureIds) {
      if (error) {
        res.send(500, error);
      } else {
        res.send({'featuresAdded': featureIds});
      }
    });
  });

}