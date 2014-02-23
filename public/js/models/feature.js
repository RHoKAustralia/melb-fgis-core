define(['backbone', 'underscore'], function(Backbone, _) {
  var Feature = Backbone.Model.extend({
    toJSON: function(options) {
      return _.omit(this.attributes, ['id', 'type']);
    }
  });
  return Feature;
});
