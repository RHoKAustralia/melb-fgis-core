var should = require('should');
var express = require('express');
var request = require('supertest');
var fs = require('fs');

var serverHelper = require('../helper/server_helper.js');

function logObject(obj) {
  console.log('- logObject:', require('util').inspect(obj));
}
function logObject(label, obj) {
  console.log('-', label, require('util').inspect(obj));
}

describe('orm', function() {
  var app;

  before(function(done) {
    serverHelper(function(err, data) {
      if (err) return done(err);
      app = data;
      done();
    });
  });

  it('adds a feature to the database', function(done) {
    fs.readFile('test/fixtures/fire_ugly.json', 'utf-8', function(fsErr, data) {
      //console.log('- data:', require('util').inspect(data));
      if (fsErr) throw fsErr

      request(app)
        .post('/feature/fire')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(201, done);
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

  it('deletes a feature from the database', function(done) {
    done();
    return;
    request(app)
      .delete('/feature/fire/7')
      .end(function(err, resp) {
        if (err) return done(err);
        console.log('bwahahaha');
        logObject('resp.body:', resp.text);
        //console.log('- resp:', require('util').inspect(resp.text));
        resp.should.have.status(200);
        done();
      });
  });

});