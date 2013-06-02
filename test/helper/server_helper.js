var winston = require('winston');
var requestLogger = require('winston-request-logger');
var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({colorize:true}) ] });

module.exports = function(cb){

  var express = require('express')
    , app = express()
    , http = require('http')
    , nconf = require('nconf')
    , winston = require('winston')
    , fgisOrm = require('../../lib/fgis-orm')

  app.use(requestLogger.create(logger))

  app.use(express.bodyParser())

  // merge nconf overrides with the configuration file.
  nconf.argv().env().file({ file: './local.json' })

  console.log('nconf', nconf.get('connectionUri'))

  fgisOrm(app, nconf);

  // Routes
  require('../../routes')(app)

  cb(null, app)
}