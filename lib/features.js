exports.addFireFeature = function (feature, db, cb) {
  db.models.feature.create([
    {
      'description': feature.description, 'geo': feature.geo, 'updatedAt': new Date()
    }
  ], function (err, items) {
    if (err) {
      cb(err);
      return;
    }
    var successIds = [];
    for (var i = 0; i < items.length; i++) {
      successIds.push(items[i].id);
    }
    cb(null, successIds);
  });
}
exports.getFireFeatures = function (db, cb) {
  db.models.feature.find({}, function (err, fires) {
    if (err) {
      cb(err);
      return;
    }
    cb(null, fires);
  });
}
exports.getFireFeature = function (db, id, cb) {
  db.models.feature.find({'id': id}, function (err, fires) {
    if (err) {
      cb(err);
      return;
    }
    cb(null, fires[0]);
  });
}

