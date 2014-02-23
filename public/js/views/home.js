define(function() {
  var Home = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this);

      this.pois = options.pois;

      this.pois.on('add', this.addMarker);
      this.pois.on('change', this.changeMarker);

      this.markers = {};
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
    startFollowing: function() {
      this.locateControl.locate();
    },
    locationFound: function(locationEv) {
      if (app.myLocation) {
        app.myLocation.updateLatLng(locationEv.latlng)
        app.myLocation.save();
      } else {
        app.myLocation = new models.Location({
          description: "Vehicle " + Math.floor(Math.random() * 90 + 10),
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
        app.myLocation.save({}, {
          success: function(myLocation) {
            app.locationId = myLocation.id
            localStorage.setItem('my_location_id', myLocation.id);
            app.pois.add(myLocation);
          }
        });
      }
      this.otherLocations.bringToFront();
      this.locateControl._circleMarker.bringToFront();
    },
    render: function() {
      var components = ['critical', 'overlay', 'team', 'weather', 'feed'];
      for (var i = 0; i < components.length; ++i) {
        var component = components[i];
        $('#' + component).on('click', this[component]);
      };
      var map = this.map = L.map('map').setView([-37.793566209439, 144.94111608134], 14);

      L.tileLayer('http://{s}.tile.cloudmade.com/aeb94991e883413e8262bd55def34111/997/256/{z}/{x}/{y}.png', {
        attribution: 'Made with love at <a href="https://github.com/organizations/rhok-melbourne/">RHoK Melbourne</a>, Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
      }).addTo(map);
      this.locateControl = L.control.locate().addTo(map);
      this.otherLocations = L.featureGroup().addTo(map);
      map.on('locationfound', this.locationFound);

      return this
    },
    addMarker: function(poi) {
      if (!app.myLocation && poi.id == app.locationId) {
        app.myLocation = poi;
      }
      if (app.myLocation == poi) {
        // no need to draw my own marker: leaflet-locatecontrol does that for us
        return;
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
  });
  return Home;
});
