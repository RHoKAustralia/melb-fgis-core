var should = require('should');
//var fgisOrm = require('../../lib/fgis-orm');
var express = require('express');
var request = require('supertest');
var fs = require('fs');

var serverHelper = require('../helper/server_helper.js');

describe('orm', function() {
  var app;

  before(function(done) {
    serverHelper(function(err, data) {
      if (err) throw err;
      app = data;
      done();
    });
  });

  it('adds and deletes a feature from the database', function(done) {
    fs.readFile('test/fixtures/fire_good.json', 'utf-8', function(err, data) {
      //console.log('- data:', require('util').inspect(data));
      if (err) throw err

      request(app)
        .post('/feature/fire')
        .set('Content-Type', 'application/json')
        .send(data)
        .end(function(err, res) {
          console.log('- res:', require('util').inspect(res.text));
          res.should.have.status(200);
          done();
        });
    });
  });

});