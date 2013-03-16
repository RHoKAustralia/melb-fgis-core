module.exports = function(app) {

    // Home/main
    app.get('/', function(req, res) {

      req.db.models.feature.find({"description": ""},  function(err, features){

      })

        res.render('index', { title: 'fgis-core' })
    })

}