# fgis-core

FGIS core project

These project include:

* [connect-cachify](https://github.com/mozilla/connect-cachify)
* [twitter bootstrap](http://twitter.github.com/bootstrap/)
* [JQuery](http://jquery.com/)
* [bower](http://twitter.github.com/bower/)
* [jade](http://jade-lang.com/)
* [winston-request-logger](https://github.com/wolfeidau/winston-request-logger)


## Getting Started

Once created you can set up your web application project by running the following commands.

* Firstly run npm to install modules.

```
npm install

* Install postgres:
(mac osx): 
```
brew install postgres

* Create role and database

```
CREATE DATABASE fgis_development;
CREATE ROLE fgis_development CREATEDB LOGIN;


```

* Start the application.

```
node app.js
```

* Run tests

```
NODE_ENV=test node_modules/.bin/mocha --reporter spec --recursive test
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Mark Wolfe
Licensed under the MIT license.