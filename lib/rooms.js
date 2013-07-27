"use strict";

var log = require('debug')('fgis:ws')

module.exports = function(primus){

  primus.on('connection', function (spark) {

    log('spark')

    spark.join('alerts');

    // join rooms on request
    spark.on('data', function(room) {
      log('join', room);
      if (room !== 'none') {
        spark.join(room);
      }
      else {
        spark.leaveAll();
      }
    });
  })

}

/*
var watchEvents = function (io) {

  // get data from db

  var fire = {
    "featureCollection": [
      {
        "type": "Feature",
        "properties": {
          "description": "origin"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            15875934.464566292,
            -4372289.554702327
          ]
        }
      }
    ]
  };
  io.sockets.emit('watchEvents', {event: fire})
}

module.exports = function (io) {

  // register table watcher
  setInterval(watchEvents, 10000, io);

}

*/
