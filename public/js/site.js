requirejs.config({
  baseUrl: 'js',
  paths: {
    jquery: '/components/jquery/jquery',
    backbone: '/components/backbone/backbone',
    underscore: '/components/underscore/underscore'
  },
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    }
  }
});

requirejs(['jquery', 'backbone', 'collections', 'models', 'views'], function($, Backbone, collections, models, views) {

  var Router = Backbone.Router.extend({
    routes: {
      '': 'home'
    }
  });

  $(function() {
    var app = window.app = {};
    app.views = {};

    var locations = new collections.Locations();
    var fires = new collections.Fires();

    var home = new views.Home({
      locations: locations,
      fires: fires
    });

    app.router = new Router();

    app.router.on('route:home', function() {
      home.render();
      app.locationId = localStorage.getItem('my_location_id');
      locations.fetch({
        success: function() {
          home.startFollowing();
        }
      });
      fires.fetch();
    });

    Backbone.history.start();

    // Let's test it...

    // subscribe to stuff
    //    app.socket = io.connect('http://localhost:3000')
    //console.log('loading', 'primus')
    //window.primus = Primus.connect('ws://localhost:3000');

    /*
    app.socket.on('watchEvents', function(data){

      console.log(data)

      app.event = data.event;

      L.geoJson(event.featureCollection).addTo(app.views.map)

      // update the map

      // update the event list

      // update the local weather

      // update temp and status

    })
    */

    // // check local storage for location id, or use existing one.
    // navigator.geolocation.getCurrentPosition(function(position) {
    //   afterLocation(position.coords.latitude, position.coords.longitude);
    // });

    // setTimeout(function() {
    // app.pois.get(1234).set({
    //   lat: -37.803566209439
    // })
    // }, 4000)

  });

});
