define(['models/fire'], function(Fire) {
  var Fires = Backbone.Collection.extend({
    model: Fire,
    url: '/feature/fire',
  });
  return Fires;
});
