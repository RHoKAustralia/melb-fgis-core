var svr = require('../helper/server_helper.js')
var request = require('supertest')
var fs = require('fs')

/*
  MORE EXAMPLES AT https://github.com/visionmedia/supertest/blob/master/test/supertest.js
 */

describe('HTTP', function () {

  var app

  before(function (done) {

    svr(function (err, data) {
      if (err) throw err
      app = data
      done()
    })

  })

  it('should POST', function (done) {

//    fs.readFile('', function (err, data) {
//      if (err) throw err
    request(app)
      .post('/feature/fire')
      .set('Content-Type','application/json')
      .send(JSON.stringify({ username: 'test', password: 'pass' }))
      .end(function(err, res){
        res.should.have.status(200);
      })

//    })

  })


})