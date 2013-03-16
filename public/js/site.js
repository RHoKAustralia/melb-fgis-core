(function($) {

  var models =
    {
      Poi: Backbone.Model.extend(
        {
          defaults:
            {
              id: undefined
            , lat: undefined
            , long: undefined
            }
        }
      )
    }

  var collections =
    {
      Pois: Backbone.Collection.extend(
        {
          model: models.Poi
        }
      )
    }

  var views =
    {
      Home: Backbone.View.extend(
        {
          initialize: function(options) {
            _.bindAll(this)

            this.pois = options.pois

            this.pois.on('add', this.addMarkers)
            this.pois.on('change', this.changeMarker)

            this.markers = {}
          }
        , render: function() {
            this.map = L.map('map').setView([-37.793566209439, 144.94111608134], 14)

            L.tileLayer('http://{s}.tile.cloudmade.com/aeb94991e883413e8262bd55def34111/997/256/{z}/{x}/{y}.png',
              {
                attribution: 'Made with love at <a href="https://github.com/vertis/rhok-fgis/">RHoK Melbourne</a>, Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
              , maxZoom: 18
              }
            ).addTo(this.map)

            return this
          }
        , addMarkers: function() {
            _.each(this.pois.models, this.addMarker)
          }
        , addMarker: function(poi) {
            this.markers[poi.id] = this.markers[poi.id] || L.marker([poi.attributes.lat, poi.attributes.long]).addTo(this.map)
          }
        , changeMarker: function(poi) {
            this.markers[poi.id].setLatLng([poi.attributes.lat, poi.attributes.long])
          }
        }
      )
    }

  var Router = Backbone.Router.extend(
    {
      routes:
        {
          '': 'home'
        }
    }
  )

  $(function() {

    var app = window.app = {}

    app.views = {}

    app.pois = new collections.Pois()

    app.views.home = new views.Home({
      pois: app.pois
    })

    app.router = new Router()

    app.router.on('route:home', function() {
      app.views.home.render()
    })

    Backbone.history.start()

    // Let's test it...

    // subscribe to stuff
    app.socket = io.connect('http://localhost:3000')

    app.socket.on('watchEvents', function(data){

      console.log(data)

      app.event = data.event;

      L.geoJson(event.event.featureCollection).addTo(app.views.map)

      // update the map

      // update the event list

      // update the local weather

      // update temp and status


    })


    setTimeout(function() {

      app.pois.add(
        {
          id: 1234
        , lat: -37.793566209439
        , long: 144.94111608134
        }
      )
    }, 3000)

    setTimeout(function() {
      app.pois.get(1234).set({lat: -37.803566209439})
    }, 4000)

  })

}(jQuery))