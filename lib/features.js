"use strict";

var log = require('debug')('orm');

var gjPoint = 'Point';
var gjLine  = 'LineString';
var gjArea  = 'Polygon';

var gjFeature = 'Feature';
var gjFeatureCollection = 'FeatureCollection';

var joi = require('joi');
var T = joi.types;
var isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
var schema = {
  feature: {
    description: T.String().max(255).required()
  , updatedAt:   T.String().regex(isoDateRegex).required().optional()
  , geo:         T.Object().required()
  }
, geoJson: {
    type:     T.String().required().valid(gjFeatureCollection)
  , features: T.Array().required()
  }
, geoJsonFeature: function(type) {
    return {
      type:       T.String().required().valid(gjFeature)
    , properties: T.Object().required().optional()
    , geometry:   T.Object({
        type:        T.String().required().valid(featureProps[type].geo)
      , coordinates: T.Array().required()
      }).required()
    }
  }
};

function verifyAllowedGeo(featureType, geo) {
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
}
var extractJoiMessages = function(error) {
  return error._errors.map(function(it) { return it.message; });
};
var joiValidate = function(featureType, jsonObj) {
  var error = joi.validate(jsonObj, schema.feature);
  if (error) {
    return extractJoiMessages(error);
  }
  error = joi.validate(jsonObj.geo, schema.geoJson);
  if (error) {
    return extractJoiMessages(error);
  }
  var gjFeatures = jsonObj.geo.features;
  for (var i = 0; i < gjFeatures.length; i++) {
    var f = gjFeatures[i];
    error = joi.validate(f, schema.geoJsonFeature(featureType));
    if (error) {
      return extractJoiMessages(error);
    }
  }
};
exports._verifyAllowedGeo = verifyAllowedGeo;
exports._validate = joiValidate;

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

var defaultAdd = function(featureType) {
  return function(db, jsonObj, cb) {
    var errors = joiValidate(featureType, jsonObj) || verifyAllowedGeo(featureType, jsonObj.geo);
    if (errors) {
      return cb({status: 400, message: errors});
    }

    var updatedAt = jsonObj.updatedAt ? new Date(jsonObj.updatedAt) : new Date();
    db.models.feature.create([
      {
        type: featureType
      , description: jsonObj.description
      , updatedAt: updatedAt
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
var defaultModOne = function(featureType) {
  return function(db, featureId, jsonObj, cb) {
    var errors = joiValidate(featureType, jsonObj) || verifyAllowedGeo(featureType, jsonObj.geo);
    if (errors) {
      return cb({status: 400, message: errors});
    }

    var updatedAt = jsonObj.updatedAt ? new Date(jsonObj.updatedAt) : new Date();
    db.models.feature.get(featureId, function(err, feature) {
      if (err) {
        return cb({status: 404, message: err});
      }

      feature.updatedAt = updatedAt;
      feature.description = jsonObj.description;
      feature.geo = jsonObj.geo;

      feature.save(defaultSuccess(cb));
    });
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
  fire:     { geo: [gjPoint, gjLine, gjArea] }
, location: { geo: [gjPoint] }
, test:     { geo: [gjLine, gjArea], rest: {
    addOne: function(db, jsonObj, cb)   { cb(null, { id: 'addOne' }); }
  , getAll: function(db, cb)            { cb(null, { message: 'getAll' }); }
  , getOne: function(db, featureId, cb) { cb(null, { message: 'getOne', id: featureId }); }
  , delOne: function(db, featureId, cb) { cb(null); }
  } }
};

var addProperties = function(aType) {
  var safeType = String(aType);
  var autoMethods = featureProps[safeType].rest || {};
  exports[safeType] = {
    allowedGeo: featureProps[safeType].geo || []
  , addOne: autoMethods.addOne || defaultAdd(safeType)
  , getAll: autoMethods.getAll || defaultGetAll(safeType)
  , getOne: autoMethods.getOne || defaultGetOne(safeType)
  , modOne: autoMethods.modOne || defaultModOne(safeType)
  , delOne: autoMethods.delOne || defaultDelete(safeType)
  };
}
for (var autoType in featureProps) {
  addProperties(autoType);
}
