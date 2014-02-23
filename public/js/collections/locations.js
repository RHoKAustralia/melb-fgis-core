define(['models/location'], function(Location) {
  var Locations = Backbone.Collection.extend({
    model: Location,
    url: '/feature/location',
  });
  return Locations;
});
