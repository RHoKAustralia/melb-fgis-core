var log = require('debug')('orm')

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
      cb(null, items[0].id);
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
  return function(jsonObj, db, cb) {
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

var methodNames = {
  fire: { add: 'addFire', getAll: 'allFires', getOne: 'getFire', del: 'deleteFire' }
, location: { add: 'addLocation', getAll: 'allLocations', getOne: 'getLocation', del: 'deleteLocation' }
};
for (var autoType in methodNames) {
  var autoMethods = methodNames[autoType];

  exports[autoMethods.add] = defaultAdd(new String(autoType));
  exports[autoMethods.getAll] = defaultGetAll(new String(autoType));
  exports[autoMethods.getOne] = defaultGetOne(new String(autoType));
  exports[autoMethods.del] = defaultDelete(new String(autoType));
};