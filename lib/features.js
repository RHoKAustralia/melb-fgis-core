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
  fire: {}
, location: {}
, test: {
    addOne: function(db, jsonObj, cb)   { cb(null, { id: 'addOne' }); }
  , getAll: function(db, cb)            { cb(null, { message: 'getAll' }); }
  , getOne: function(db, featureId, cb) { cb(null, { message: 'getOne', id: featureId }); }
  , delOne: function(db, featureId, cb) { cb(null); }
  }
};

var addMethods = function(aType) {
  var safeType = new String(aType);
  var autoMethods = methodNames[safeType];
  exports[safeType] = {
    addOne: autoMethods.addOne || defaultAdd(safeType)
  , getAll: autoMethods.getAll || defaultGetAll(safeType)
  , getOne: autoMethods.getOne || defaultGetOne(safeType)
  , delOne: autoMethods.delOne || defaultDelete(safeType)
  };
}
for (var autoType in methodNames) {
  addMethods(autoType);
};
