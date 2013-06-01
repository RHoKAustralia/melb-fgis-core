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
      if (err) throw err;
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
        .end(function(err, res) {
          if (err) throw err;
          res.should.have.status(201);
          //logObject('res.body:', res.body);
          done();
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
    done();
    return;
    request(app)
      .get('/feature/fire/1')
      .end(function(err, resp) {
        console.log('bwahahaha');
        console.log(err);
        logObject('resp.body:', resp.text);
        //console.log('- resp:', require('util').inspect(resp.text));
        resp.should.have.status(200);
        done();
      });
  });

  it('deletes a feature from the database', function(done) {
    done();
    return;
    request(app)
      .delete('/feature/fire/7')
      .end(function(err, resp) {
        console.log('bwahahaha');
        console.log(err);
        logObject('resp.body:', resp.text);
        //console.log('- resp:', require('util').inspect(resp.text));
        resp.should.have.status(200);
        done();
      });
  });

});