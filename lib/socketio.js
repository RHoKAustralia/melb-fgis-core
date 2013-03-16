var internal = {}

module.exports = function (io) {

  // register table watcher
  setInterval(internal.watchEvents, 10000, io);

}

internal.watchEvents = function (io) {

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