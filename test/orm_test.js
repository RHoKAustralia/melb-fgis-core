var should = require('should')
, fgisOrm = require('../lib/fgis-orm')


describe('orm', function(){

  it('should load the orm', function(done){

    //var fgisOrm = new FgisOrm(/* inject stuff later */);

    fgisOrm.getEvents('beer', function(err, result){

      // assert / read results



      done();

    })

  })

})