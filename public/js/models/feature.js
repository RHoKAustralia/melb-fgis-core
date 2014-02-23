define(function() {
  var Feature = Backbone.Model.extend({
    toJSON: function(options) {
      return _.omit(this.attributes, ['id', 'type']);
    }
  });
  return Feature;
});
