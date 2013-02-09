var internal = {}

module.exports = function (io) {

    // register table watcher
    setInterval(internal.watchEvents, 60000, io)

}

internal.watchEvents = function(io) {

    io.sockets.emit('watchEvents', {event: 'test'})

}