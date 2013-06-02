var should = require('should');
var express = require('express');
var request = require('supertest');
var fs = require('fs');

var log = require('debug')('test')

var serverHelper = require('../helper/server_helper.js');

describe('orm', function() {
  var app;

  before(function(done) {
    serverHelper(function(err, data) {
      if (err) return done(err);
      app = data;
      done();
    });
  });

  var tempId;
  it('adds a feature to the database', function(done) {
    fs.readFile('test/fixtures/fire_ugly.json', 'utf-8', function(fsErr, data) {
      //console.log('- data:', require('util').inspect(data));
      if (fsErr) throw fsErr

      request(app)
        .post('/feature/fire')
        .set('Content-Type', 'application/json')
        .send(data)
        .end(function(err, res) {
          res.should.have.status(201);
          tempId = JSON.parse(res.text).id;
          done(err);
        });
    });
  });

  it('gets features from the database', function(done) {
    request(app)
      .get('/feature/fire')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('gets a feature from the database', function(done) {
    request(app)
      .get('/feature/fire/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('deletes a feature from the database'); /*, function(done) {
    var path = '/feature/fire/' + tempId;
    log('path', path);
    request(app)
      .del(path)
      .end(function(err, res) {
        log('end');
        res.should.have.status(200);
        done(err);
      });
    done();
  });*/

});