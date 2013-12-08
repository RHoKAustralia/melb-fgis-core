(function($) {

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

  var models = {}
  models.Poi = Backbone.Model.extend({
    toJSON: function(options) {
      return _.omit(this.attributes, ['id', 'type'])
    }
  })
  models.Location = models.Poi.extend({
    urlRoot: '/feature/location',
    latLng: function() {
      var coordinates = this.get('geo').features[0].geometry.coordinates;
      return L.latLng(coordinates[1], coordinates[0])
    },
    updateLatLng: function(latlng) {
      this.set('geo', {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [latlng.lng, latlng.lat]
          }
        }]
      });
    }
  });
  var modelForType = {
    location: models.Location,
    fire: models.Poi
  }

  var collections = {
    Pois: Backbone.Collection.extend({
      model: function(attrs, options) {
        var model = modelForType[attrs.type];
        return new model(attrs, options);
      },
      url: '/feature',
    })
  }

  var views = {
    Home: Backbone.View.extend({
      initialize: function(options) {
        _.bindAll(this)

        this.pois = options.pois

        this.pois.on('add', this.addMarker)
        this.pois.on('change', this.changeMarker)

        this.markers = {}
      },
      styleMap: {
        'fire': function(poi) {
          return {
            style: {
              color: "#EE0000",
              weight: 5,
              opacity: 0.65
            }
          };
        },
        'location': function(poi) {
          return {
            pointToLayer: function(feature, latlng) {
              if (poi == app.myLocation) return;

              if (app.views.home.markers[poi.id]) {
                console.log("Duplicate marker for " + poi.id)
              }
              var marker = app.views.home.markers[poi.id] = L.circleMarker(latlng, {
                color: "#9BDC59",
                fillColor: "#3A3",
                fillOpacity: 1.0,
                opacity: 1.0,
                radius: 7.5,
                weight: 2.5,
              });
              marker.bindPopup(poi.get('description'));
              return marker;
            }
          };
        }
      },
      writeLocationId: function(response) {
        localStorage.setItem('my_location_id', response.get('id'));
      },
      startFollowing: function() {
        this.locateControl.locate();
      },
      locationFound: function(locationEv) {
        if (app.myLocation) {
          app.myLocation.updateLatLng(locationEv.latlng)
          app.myLocation.save();
        } else {
          app.myLocation = new models.Location({
            description: "My Location",
            type: 'location',
            geo: {
              type: "FeatureCollection",
              features: [{
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [locationEv.latlng.lng, locationEv.latlng.lat]
                }
              }]
            }
          });
          app.pois.create(app.myLocation, {
            success: this.writeLocationId
          });
        }
        this.otherLocations.bringToFront();
        this.locateControl._circleMarker.bringToFront();
      },
      render: function() {
        $('#critical').on('click', this.critical);
        $('#overlay').on('click', this.overlay);
        $('#team').on('click', this.team);
        $('#weather').on('click', this.weather);
        $('#feed').on('click', this.feed);
        var map = this.map = L.map('map').setView([-37.793566209439, 144.94111608134], 14)

        L.tileLayer('http://{s}.tile.cloudmade.com/aeb94991e883413e8262bd55def34111/997/256/{z}/{x}/{y}.png', {
          attribution: 'Made with love at <a href="https://github.com/organizations/rhok-melbourne/">RHoK Melbourne</a>, Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
          maxZoom: 18
        }).addTo(map)
        this.locateControl = L.control.locate().addTo(map);
        this.otherLocations = L.featureGroup().addTo(map);
        map.on('locationfound', this.locationFound);

        return this
      },
      addMarker: function(poi) {
        if (!app.myLocation && poi.id == app.locationId) {
          app.myLocation = poi;
        }
        try {
          var marker = L.geoJson(poi.get('geo'), this.styleMap[poi.get('type')](poi));
          marker.addTo(this.otherLocations);
        } catch (e) {
          console.log("Could not add marker for POI", poi, e);
        }
      },
      changeMarker: function(poi) {
        var marker = this.markers[poi.id];
        if (marker) {
          marker.setLatLng(poi.latLng());
        }
      },
      critical: function() {
        $('#top-menu').find('a.selected').removeClass('selected');
        $('#critical').addClass('selected');
      },
      overlay: function() {
        $('#top-menu').find('a.selected').removeClass('selected');
        $('#overlay').addClass('selected');
      },
      team: function() {
        toggleDataFrame('team', 'Team Test')
      },
      weather: function() {
        toggleDataFrame('weather', 'Weather Test')
      },
      feed: function() {
        toggleDataFrame('feed', 'Feed Test')
      }
    })
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

}(jQuery))
