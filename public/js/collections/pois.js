define(['models'], function(models) {
  var modelForType = {
    location: models.Location,
    fire: models.Poi
  };

  var Pois = Backbone.Collection.extend({
    model: function(attrs, options) {
      var model = modelForType[attrs.type];
      return new model(attrs, options);
    },
    url: '/feature',
  });
  return Pois;
});
