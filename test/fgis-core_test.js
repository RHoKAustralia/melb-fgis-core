var should = require('should'),
    fgis_core = require('../lib/fgis-core.js')


describe('fgis-core', function () {
    before(function () {

    })
    it('should be awesome', function(){
        fgis_core.awesome().should.eql('awesome')
    })
})