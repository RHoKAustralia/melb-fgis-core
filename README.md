# fgis-core

HotSpot web-app and maptile server.

## Description

### The Problem

Fire-fighters currently use paper maps and radios for all their communications. This method is cumbersome and inaccurate. There have not been any technical solutions yet, because most of them involve dedicated infrastructure.

### A Solution

Almost everyone has some kind of smart device on them at all times (i.e. phone, tablet, etc). We can leverage this ubiquitous technology to avoid double-handling all this information, and augment current information with new feeds, including accurate personnel & vehicle locations, and other incident features, over time.

### This Repo

This is the main repo for the HotSpot project (formerly FireGround Information System, and also Universal Emergency Response Management). There are a heap of other repos (listed below), but most of them are old WIPs or spikes.

Most of the documentation/collateral can be found here: [`fgis/doc`](https://github.com/rhok-melbourne/fgis/tree/master/doc).

### Other Repos

- [`fgis`](https://github.com/rhok-melbourne/fgis) - Rails app from the first hack. Also most of the docs are here.
  - [`fgis-java`](https://github.com/rhok-melbourne/fgis-java) - Java port of the original Rails app.
- [`fgis-vagrant`](https://github.com/rhok-melbourne/fgis-vagrant) - Vagrant project to spin up the web app.
- [`fgis-navigator`](https://github.com/rhok-melbourne/fgis-navigator) - UI spike for the web-app front-end.
- [`fgis-p2p`](https://github.com/rhok-melbourne/fgis-p2p) - JavaScript Spike for peer communication.
- [`fgis-mesh-spike`](https://github.com/rhok-melbourne/fgis-mesh-spike) - Hardware spike for mesh radio communications.

## Getting Started

Once created, you can set up your web application project by running the following commands.

### Mac OSX install instructions:
> Using [Homebrew](http://brew.sh/)

- Install Node.js: ```brew install node```
- Install postgres: ```brew install postgres```

### Then generic install instructions:

- Install bower: ```npm install -g bower```
- Create role and database

```
initdb -D <data-file-location>
postgres -D <data-file-location> &
psql postgres
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

## Attribution (kinda)

This app includes: [connect-cachify](https://github.com/mozilla/connect-cachify), [twitter bootstrap](http://twitter.github.com/bootstrap/), [JQuery](http://jquery.com/), [bower](http://twitter.github.com/bower/), [jade](http://jade-lang.com/), [winston-request-logger](https://github.com/wolfeidau/winston-request-logger) . . .
