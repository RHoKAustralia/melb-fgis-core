define(['backbone', 'underscore'], function(Backbone, _) {
  var toggleDataFrame = function(dataFrameId, title) {
    var idSelector = '#' + dataFrameId;

    if ($(idSelector).hasClass('selected')) {
      $('#bottom-menu').find('a.selected').removeClass('selected');
      $('#data-frame').fadeOut('fast');
    } else {
      $('#bottom-menu').find('a.selected').removeClass('selected');
      $(idSelector).addClass('selected');
      $('#data-frame').fadeIn('fast').empty().append('<p>' + title + '</p>');
      // window.primus.write('none');
      // window.primus.write(dataFrameId);
    }
  };

  var Home = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this);

      var collections = ['locations', 'fires'];
      for (var i = 0; i < collections.length; ++i) {
        var type = collections[i];
        this[type] = options[type];
        this[type].on('add', this.addMarker);
        this[type].on('change', this.changeMarker);
      };
      this.markers = {};
    },
    styleMap: function() {
      var view = this;
      return {
        fire: function(feature) {
          return {
            style: {
              color: "#EE0000",
              weight: 5,
              opacity: 0.65
            }
          };
        },
        location: function(feature) {
          return {
            pointToLayer: function(_, latlng) {
              if (view.markers[feature.id]) {
                console.log("Duplicate marker for " + feature.id);
              }
              var marker = view.markers[feature.id] = L.circleMarker(latlng, {
                color: "#9BDC59",
                fillColor: "#3A3",
                fillOpacity: 1.0,
                opacity: 1.0,
                radius: 7.5,
                weight: 2.5,
              });
              marker.bindPopup(feature.get('description'));
              return marker;
            }
          };
        }
      };
    },
    startFollowing: function() {
      this.locateControl.locate();
    },
    locationFound: function(locationEv) {
      var view = this;
      if (app.myLocation) {
        app.myLocation.updateLatLng(locationEv.latlng);
        app.myLocation.save();
      } else {
        app.myLocation = this.locations.create({
          description: "Vehicle " + Math.floor(Math.random() * 90 + 10),
          type: 'location',
          geo: {
            type: "FeatureCollection",
            features: [ {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [locationEv.latlng.lng, locationEv.latlng.lat]
              }
            } ]
          }
        }, {
          success: function(myLocation) {
            app.locationId = myLocation.id
            localStorage.setItem('my_location_id', myLocation.id);
          },
          wait: true
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

      return this;
    },
    addMarker: function(feature) {
      if (!app.myLocation && feature.id == app.locationId) {
        app.myLocation = feature;
      }
      if (app.myLocation == feature) {
        // no need to draw my own marker: leaflet-locatecontrol does that for us
        return;
      }
      try {
        var marker = L.geoJson(feature.get('geo'), this.styleMap()[feature.get('type')](feature));
        marker.addTo(this.otherLocations);
      } catch (e) {
        console.log("Could not add marker for POI", feature, e);
      }
    },
    changeMarker: function(feature) {
      var marker = this.markers[feature.id];
      if (marker) {
        marker.setLatLng(feature.latLng());
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
