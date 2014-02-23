define(['backbone', 'models/fire'], function(Backbone, Fire) {
  var Fires = Backbone.Collection.extend({
    model: Fire,
    url: '/feature/fire',
  });
  return Fires;
});
