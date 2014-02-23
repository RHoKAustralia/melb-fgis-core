define(function() {
  var Poi = Backbone.Model.extend({
    toJSON: function(options) {
      return _.omit(this.attributes, ['id', 'type'])
    }
  });
  return Poi;
});
