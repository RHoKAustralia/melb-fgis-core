define(['backbone', 'models/location'], function(Backbone, Location) {
  var Locations = Backbone.Collection.extend({
    model: Location,
    url: '/feature/location',
  });
  return Locations;
});
