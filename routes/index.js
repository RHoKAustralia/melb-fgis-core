"use strict";
var log = require('debug')('rest');
var feature = require('../lib/features.js');

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('index', { title: 'fgis-core' });
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
    return function(err, featureInfo) {
      if (err) {
        res.send(500, err);
      } else {
        res.send(201, featureInfo);
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

  app.get('/feature', function(req, res) {
    feature.all(req.db, defaultResponse(res));
  });

  app.get('/feature/:featureType', function(req, res) {
    var ft = req.params.featureType;
    feature[ft].getAll(req.db, defaultResponse(res));
  });
  app.get('/feature/:featureType/:id', function(req, res) {
    var ft = req.params.featureType;
    var id = req.params.id;
    feature[ft].getOne(req.db, id, defaultResponse(res));
  });
  app.post('/feature/:featureType', function(req, res) {
    var ft = req.params.featureType;
    feature[ft].addOne(req.db, req.body, defaultAddResponse(res));
  });
  //TODO: app.put('/feature/:featureType/:id')
  app.delete('/feature/:featureType/:id', function(req, res) {
    var ft = req.params.featureType;
    var id = req.params.id;
    feature[ft].delOne(req.db, id, defaultDeleteResponse(res));
  });

};
