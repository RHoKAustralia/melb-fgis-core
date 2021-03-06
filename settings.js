module.exports = function (app, configurations, express, logger) {

    var nconf = require('nconf')
        , gzippo = require('gzippo')
        , cachify = require('connect-cachify')
        , winston = require('winston')
        , requestLogger = require('winston-request-logger')
        , fgisOrm = require('./lib/fgis-orm')

    nconf.argv().env().file({ file: 'local.json' })

    fgisOrm(app, nconf);

    // load assets node from configuration file.
    var assets = nconf.get('assets') || {}

    // Development Configuration
    app.configure('development', 'test', function () {
        console.log('ENV DEV / TEST')
        // register the request logger
        app.use(requestLogger.create(logger))
        app.set('DEBUG', true)
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
    })

    // Production Configuration
    app.configure('production', function () {
        app.set('DEBUG', false)
        app.use(express.errorHandler())
    })

    // Cachify Asset Configuration
    // Commented out for now until we figure out how to integrate RequireJS
    // with the cachify assets configuration.
    // We can worry about production optimisation when we get closer to putting
    // this into production.
    // app.use(cachify.setup(assets, {
    //     root: __dirname + '/public',
    //     production: nconf.get('cachify')
    // }))

    // Global Configuration
    app.configure(function () {

        app.set('views', __dirname + '/views')
        app.set('view engine', 'jade')
        app.set('view options', { layout: false })
        app.use(express.bodyParser())
        app.use(express.methodOverride())
        app.use(gzippo.staticGzip(__dirname + '/public'))
        app.use(express.compress())
        app.use(app.router)

    })

    return app
}
