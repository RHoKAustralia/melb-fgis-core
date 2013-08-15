"use strict";
var express = require('express')

var configurations = module.exports

var app = express()

var http = require('http')
var server = http.createServer(app)
var Primus = require('primus')
var Rooms = require('primus-rooms');

var primus = new Primus(server, { parser: 'JSON' })
//var io = require('socket.io').listen(server)
var nconf = require('nconf')
var winston = require('winston')

// Logging
var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({colorize:true}) ] })

// load the settings
require('./settings')(app, configurations, express, logger)

// merge nconf overrides with the configuration file.
nconf.argv().env().file({ file: 'local.json' })

// Routes
require('./routes')(app)

// regenerate the client library
primus.save(__dirname +'/public/js/primus.js');

// add rooms to Primus
primus.use('rooms', Rooms);

//require('./lib/socketio.js')(primus)


logger.info('listening on', nconf.get('port'))

server.listen(process.env.PORT || nconf.get('port'))