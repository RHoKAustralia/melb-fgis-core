"use strict";
var should = require('should');
var express = require('express');
var request = require('supertest');
var fs = require('fs');
var log = require('debug')('test');

var assertStatus = function(response, code) {
  if (response.status != code) {
    log('Error: ' + response.text);
  }
  response.should.have.status(code);
}

var serverHelper = require('../helper/server_helper.js');

describe('[REST] orm', function() {
  var app;
  var tempId;

  before(function(done) {
    serverHelper(function(err, data) {
      if (err) return done(err);
      app = data;
      done();
    });
  });

  describe('happy path', function() {

    it('adds a fire feature to the database', function(done) {
      fs.readFile('test/fixtures/fire_ugly.json', 'utf-8', function(fsErr, data) {
        //console.log('- data:', require('util').inspect(data));
        if (fsErr) throw fsErr;

        request(app)
          .post('/feature/fire')
          .set('Content-Type', 'application/json')
          .send(data)
          .end(function(err, res) {
            assertStatus(res, 201);
            tempId = JSON.parse(res.text).id;
            done(err);
          });
      });
    });

    it('gets fire features from the database', function(done) {
      request(app)
        .get('/feature/fire')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('gets a fire feature from the database', function(done) {
      request(app)
        .get('/feature/fire/' + tempId)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          res.should.have.status(200);
          var body = JSON.parse(res.text);

          body.id.should.equal(tempId);
          body.type.should.equal('fire');
          body.description.should.equal('fire_ugly.json');

          done(err);
        });
    });

    it('modifies a fire feature', function(done) {
      var path = '/feature/fire/' + tempId;
      fs.readFile('test/fixtures/fire_good.json', 'utf-8', function(fsErr, data) {
        if (fsErr) throw fsErr;

        request(app)
          .put(path)
          .set('Content-Type', 'application/json')
          .send(data)
          .end(function(err, res) {
            assertStatus(res, 200);

            request(app)
              .get(path)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .end(function(err, res) {
                res.should.have.status(200);
                var body = JSON.parse(res.text);

                body.id.should.equal(tempId);
                body.type.should.equal('fire');
                body.description.should.equal('fire_good.json');

                done(err);
              });
          });
      });
    });

    it('deletes a fire feature from the database', function(done) {
      var path = '/feature/fire/' + tempId;
      log('path', path);
      request(app)
        .del(path)
        .end(function(err, res) {
          log('end');
          res.should.have.status(200);
          done(err);
        });
    });

    it('adds a location feature to the database', function(done) {
      fs.readFile('test/fixtures/location.json', 'utf-8', function(fsErr, data) {
        if (fsErr) throw fsErr;

        request(app)
          .post('/feature/location')
          .set('Content-Type', 'application/json')
          .send(data)
          .end(function(err, res) {
            assertStatus(res, 201);
            tempId = JSON.parse(res.text).id;
            done(err);
          });
      });
    });

    it('gets location features from the database', function(done) {
      request(app)
        .get('/feature/location')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('gets a location feature from the database', function(done) {
      request(app)
        .get('/feature/location/' + tempId)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          res.should.have.status(200);
          var body = JSON.parse(res.text);

          body.id.should.equal(tempId);
          body.type.should.equal('location');
          body.description.should.equal('location.json');

          done(err);
        });
    });

    it('deletes a location feature from the database', function(done) {
      var path = '/feature/location/' + tempId;
      log('path', path);
      request(app)
        .del(path)
        .end(function(err, res) {
          log('end');
          res.should.have.status(200);
          done(err);
        });
    });

  });

  describe('sad path', function() {

    it('yields a 400 when attempting to add bad JSON', function(done) {
      fs.readFile('test/fixtures/fire_bad.json', 'utf-8', function(fsErr, data) {
        if (fsErr) throw fsErr;

        request(app)
          .post('/feature/fire')
          .set('Content-Type', 'application/json')
          .send(data)
          .end(function(err, res) {
            assertStatus(res, 400);
            log('Error messages: ' + res.text);
            done(err);
          });
      });
    });

    it('yields a 400 when attempting to modify a fire feature with bad JSON', function(done) {
      var path = '/feature/fire/' + tempId;
      fs.readFile('test/fixtures/fire_bad.json', 'utf-8', function(fsErr, data) {
        if (fsErr) throw fsErr;

        request(app)
          .put(path)
          .set('Content-Type', 'application/json')
          .send(data)
          .end(function(err, res) {
            assertStatus(res, 400);
            log('Error messages: ' + res.text);
            done(err);
          });
      });
    });

  });

});