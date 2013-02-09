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
require('./settings')(app, configurations, express, logger)

// merge nconf overrides with the configuration file.
nconf.argv().env().file({ file: 'local.json' })

// Routes
require('./routes')(app)

// Socket IO
require('./lib/socketio')(io)

logger.info('listening on', nconf.get('port'))

server.listen(process.env.PORT || nconf.get('port'))