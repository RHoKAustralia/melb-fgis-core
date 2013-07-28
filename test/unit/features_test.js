"use strict";
var should = require('should');
var features = require('../../lib/features.js');
var log = require('debug')('test');

var assertErrors = function(errors, count) {
  log('errors: ' + errors);
  errors.should.have.length(count);
};

var goodGeo = {
  "type": "FeatureCollection"
, "features": [ {
    "type": "Feature"
  , "properties": { "description": "origin" }
  , "geometry": {
      "type": "Point"
    , "coordinates": [ 15875934.464566292, -4372289.554702327 ]
    }
  } ]
};

describe('features:', function() {
  describe('joi validation', function() {

    it('requires description', function(done) {
      var err = features._validate('location', {
        updatedAt: "2013-07-27T04:23:14.207Z"
      , geo: goodGeo
      });
      assertErrors(err, 1);
      done();
    });

    it('requires updatedAt to look like a Date', function(done) {
      var err = features._validate('location', {
        description: "lol"
      , updatedAt: "not a date"
      , geo: goodGeo
      });
      assertErrors(err, 1);
      done();
    });

    it('requires geo', function(done) {
      var err = features._validate('location', {
        description: "lol"
      , updatedAt: "2013-07-27T04:23:14.207Z"
      });
      assertErrors(err, 1);
      done();
    });

  });

  describe('verifyAllowedGeo', function() {

    it('rejects null GeoJSON', function() {
      var errors = features._verifyAllowedGeo('fire', null);
      assertErrors(errors, 1);
    });

    it('rejects GeoJSON out of FeatureCollections', function() {
      var errors = features._verifyAllowedGeo('fire', {
        "type": "Feature"
      , "geometry": {
          "type": "Point"
        , "coordinates": [ 15875934.464566292, -4372289.554702327 ]
        }
      });
      assertErrors(errors, 1);
    });

    it('rejects GeoJSON with disallowed types', function() {
      var errors = features._verifyAllowedGeo('location', {
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
            "type": "Point"
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
      assertErrors(errors, 2);
    });

    it('rejects GeoJSON with no allowed geometry', function() {
      var errors = features._verifyAllowedGeo('fire', {
        "type": "FeatureCollection"
      , "features": []
      });
      assertErrors(errors, 1);
    });

    it('rejects GeoJSON with too much allowed geometry', function() {
      var errors = features._verifyAllowedGeo('location', {
        "type": "FeatureCollection"
      , "features": [ {
          "type": "Feature"
        , "geometry": {
            "type": "Point"
          , "coordinates": [ 15875934.464566292, -4372289.554702327 ]
          }
        }, {
          "type": "Feature"
        , "geometry": {
            "type": "Point"
          , "coordinates": [ 15875934.464566292, -4372289.554702327 ]
          }
        }, {
          "type": "Feature"
        , "geometry": {
            "type": "Point"
          , "coordinates": [ 15875934.464566292, -4372289.554702327 ]
          }
        } ]
      });
      assertErrors(errors, 1);
    });

  });
});
