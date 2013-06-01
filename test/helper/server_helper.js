module.exports = function(cb){

  var express = require('express')
    , configurations = module.exports
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , nconf = require('nconf')
    , winston = require('winston')

  // Logging
  var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({colorize:true}) ] })

  // load the settings
  require('../../settings.js')(app, configurations, express, logger)

  // merge nconf overrides with the configuration file.
  nconf.argv().env().file({ file: '../../local.json' })

  // Routes
  require('../../routes')(app)

  // Socket IO
  require('../../lib/socketio.js')(io)

  logger.info('listening on ' + 8888)

  server.listen(8888)

  cb(null, server)
}