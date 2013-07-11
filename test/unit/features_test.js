var should = require('should');
var features = require('../../lib/features.js');
var log = require('debug')('test');

describe('features', function() {
  describe('add', function() {

    it('rejects null GeoJSON', function() {
      var errors = features.verifyAllowedGeo('fire', null);
      log('errors: ' + errors);
      errors.should.have.length(1);
    });

    it('rejects GeoJSON out of FeatureCollections', function() {
      var errors = features.verifyAllowedGeo('fire', {
        "type": "Feature"
      , "geometry": {
          "type": "Point"
        , "coordinates": [ 15875934.464566292, -4372289.554702327 ]
        }
      });
      log('errors: ' + errors);
      errors.should.have.length(1);
    });

    it('rejects GeoJSON with disallowed types', function() {
      var errors = features.verifyAllowedGeo('location', {
        "type": "FeatureCollection"
      , "features": [ {
          "type": "Feature"
        , "geometry": {
            "type": "Line"
          , "coordinates": [ 15875934.464566292, -4372289.554702327 ]
          }
        }, {
          "type": "Feature"
        , "geometry": {
            "type": "Polygon"
          , "coordinates": [ 15875934.464566292, -4372289.554702327 ]
          }
        } ]
      });
      log('errors: ' + errors);
      errors.should.have.length(2);
    });

    it('rejects GeoJSON with no allowed geometry');

    it('rejects GeoJSON with too much allowed geometry');

  });
});
