define(['./poi'], function(Poi) {
  var Location = Poi.extend({
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
  return Location;
});
