# fgis-core

FGIS web-app and maptile server.

This includes: [connect-cachify](https://github.com/mozilla/connect-cachify), [twitter bootstrap](http://twitter.github.com/bootstrap/), [JQuery](http://jquery.com/), [bower](http://twitter.github.com/bower/), [jade](http://jade-lang.com/), [winston-request-logger](https://github.com/wolfeidau/winston-request-logger) . . .

## Getting Started

Once created, you can set up your web application project by running the following commands.

### Mac OSX install instructions:
> Using [Homebrew](http://brew.sh/)

- Install Node.js: ```brew install node```
- Install Node Package Manager: ```brew install npm```
- Install postgres: ```brew install postgres```

### Then generic install instructions:

- Install bower: ```npm install -g bower```
- Create role and database

```
psql postgres -D <data-file-location>
CREATE DATABASE fgis_development;
CREATE ROLE fgis_development CREATEDB LOGIN;
```

- Install NPM modules: ```npm install ```
- Install bower dependencies: ```bower install```

### And . . . go!
- Run tests: ```make```
- Start the application: ```node app.js```

## Maptile Server

We now have a self-provisioning ```vagrant``` box for a maptile server!
> You will need a newish version of [vagrant](http://www.vagrantup.com) . . . something that can do configuration version 2.

```
cd mbtiles-server
vagrant up
```

Stop the box when you're done:

```
vagrant halt
```

Setting up an init.d service is a bit labour intensive for now, so the provisioning script will start the service if re-run later:

```
vagrant up
vagrant provision
```

or ```vagrant up && vagrant provision``` for bash

### Node app modifications

> To use this standalone (no internet required once provisioned) tile server, a few little code changes are required. This is all in fgis-core/public/js/site.js

- The tileset only goes to zoom level 13 atm.
    - Change 14 to 13 in ```L.map('map').setView(..., 14);```. This is the inital zoom.
    - Change ```maxZoom``` from 18  to 13 in ```L.tileLayer(..., {attribution: ..., maxZoom: 18}).addTo(this.map);```.
- Update the URL.
    - Change ```http://{s}.tile.cloudmade.com/aeb94991e883413e8262bd55def34111/997/256/{z}/{x}/{y}.png``` to ```http://192.168.99.99:3000/{z}/{x}/{y}.png```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
_(Nothing yet)_

## License
Licensed under the MIT license.
