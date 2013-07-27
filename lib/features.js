"use strict";

var log = require('debug')('orm')

var gjPoint = 'Point';
var gjLine  = 'LineString';
var gjArea  = 'Polygon';

var gjFeature = 'Feature';
var gjFeatureCollection = 'FeatureCollection';

var defaultSuccess = function(cb) {
  return function(err) {
    if (err) {
      cb(err);
    } else {
      cb(null);
    }
  }
};
var defaultAddSuccess = function(cb) {
  return function(err, items) {
    if (err) {
      cb(err);
    } else {
      cb(null, { id: items[0].id });
    }
  }
};
var defaultGetAllSuccess = function(cb) {
  return function(err, items) {
    if (err) {
      cb(err);
    } else {
      cb(null, items);
    }
  }
};
var defaultGetOneSuccess = function(cb) {
  return function(err, items) {
    if (err) {
      cb(err);
    } else {
      cb(null, items[0]);
    }
  }
};

exports.verifyAllowedGeo = function(featureType, geo) {
  if (!geo) {
    return ['No geometry (' + geo + ') given.'];
  }
  if (geo.type != gjFeatureCollection) {
    return ['Geometry (' + geo.type + ') not contained by ' + gjFeatureCollection + '.'];
  }

  var typeCounts = {};
  var features = geo.features;

  for (var i = 0; i < features.length; ++i) {
    var f = features[i];
    if (f.type != gjFeature) {
      return ['Geometry (' + f.type + ') not contained by ' + gjFeature + '.'];
    }
    var t = f.geometry.type;
    if (typeCounts[t]) {
      ++typeCounts[t];
    } else {
      typeCounts[t] = 1;
    }
  }

  var allowed = exports[featureType].allowedGeo;
  var errors = [];
  for (var type in typeCounts) {
    if (allowed.indexOf(type) < 0) {
      errors.push('GeoJSON type "' + type + '" not allowed by feature type "' + featureType + '".');
    }
    if (typeCounts[type] > 1) {
      errors.push('Too many (' + typeCounts[type] + ') features of GeoJSON type "' + type + '" found.');
    }
  }
  var allowedCount = 0;
  for (var c = 0; c < allowed.length; ++c) {
    var ac = typeCounts[allowed[c]];
    if (ac) {
      allowedCount += typeCounts[allowed[c]];
    }
  }
  if (allowedCount === 0) {
    errors.push('No allowed geometry found.');
  }
  return (errors.length > 0) ? errors : null;
};

var defaultAdd = function(featureType) {
  return function(db, jsonObj, cb) {
    var errors = exports.verifyAllowedGeo(featureType, jsonObj.geo);
    if (errors) {
      return cb(errors);
    }
    db.models.feature.create([
      {
        type: featureType
      , description: jsonObj.description
      , updatedAt: new Date()
      , geo: jsonObj.geo
      }
    ], defaultAddSuccess(cb));
  };
};
var defaultGetAll = function(featureType) {
  return function(db, cb) {
    db.models.feature.find({ type: featureType }, defaultGetAllSuccess(cb));
  };
};
var defaultGetOne = function(featureType) {
  return function(db, featureId, cb) {
    db.models.feature.find({ type: featureType, id: featureId }, defaultGetOneSuccess(cb));
  };
};
var defaultDelete = function(featureType) {
  return function(db, featureId, cb) {
    db.models.feature.find({ type: featureType, id: featureId }).remove(defaultSuccess(cb));
  };
};

exports.all = function(db, cb) {
  db.models.feature.find({}, defaultGetAllSuccess(cb));
};
var featureProps = {
  fire:     { geo: [gjPoint, gjLine, gjArea], rest: {} }
, location: { geo: [gjPoint],                 rest: {} }
, test:     { geo: [gjLine, gjArea],          rest: {
    addOne: function(db, jsonObj, cb)   { cb(null, { id: 'addOne' }); }
  , getAll: function(db, cb)            { cb(null, { message: 'getAll' }); }
  , getOne: function(db, featureId, cb) { cb(null, { message: 'getOne', id: featureId }); }
  , delOne: function(db, featureId, cb) { cb(null); }
  } }
};

var addProperties = function(aType) {
  var safeType = String(aType);
  var autoMethods = featureProps[safeType].rest;
  exports[safeType] = {
    allowedGeo: featureProps[safeType].geo || []
  , addOne: autoMethods.addOne || defaultAdd(safeType)
  , getAll: autoMethods.getAll || defaultGetAll(safeType)
  , getOne: autoMethods.getOne || defaultGetOne(safeType)
  , delOne: autoMethods.delOne || defaultDelete(safeType)
  };
}
for (var autoType in featureProps) {
  addProperties(autoType);
}
