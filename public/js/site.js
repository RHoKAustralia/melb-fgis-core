requirejs.config({
  baseUrl: 'js',
  paths: {
    jquery: '/components/jquery/jquery'
  }
});

requirejs(['jquery', 'collections', 'models', 'views'], function($, collections, models, views) {

  function toggleDataFrame(dataFrameId, title) {

    var idSelector = '#' + dataFrameId;

    if ($(idSelector).hasClass('selected')) {
      $('#bottom-menu').find('a.selected').removeClass('selected');
      $('#data-frame').fadeOut('fast');
    } else {
      $('#bottom-menu').find('a.selected').removeClass('selected');
      $(idSelector).addClass('selected');
      $('#data-frame').fadeIn('fast').empty().append('<p>' + title + '</p>');
      window.primus.write('none');
      window.primus.write(dataFrameId);
    }

  }

  var Router = Backbone.Router.extend({
    routes: {
      '': 'home'
    }
  })

  $(function() {

    var app = window.app = {}

    app.views = {}

    app.pois = new collections.Pois()

    app.views.home = new views.Home({
      pois: app.pois
    })

    app.router = new Router()

    app.router.on('route:home', function() {
      app.views.home.render()
      app.locationId = localStorage.getItem('my_location_id')
      app.pois.fetch({
        update: true,
        success: function() {
          app.views.home.startFollowing();
        }
      });
    })

    Backbone.history.start()

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

  })

})
