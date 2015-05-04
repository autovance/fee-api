"use strict";
require('dotenv').load();

var restify = require('restify'),
  init = require('./app/init'),
  routes  = require('./app/routes'),

  server = restify.createServer({
    name: 'Stripe Fee API',
    version: '0.0.1-dev'
  });

// allow for parsing of body / query variables
server.use(restify.bodyParser());
server.use(restify.fullResponse());
server.use(restify.queryParser());
// sanatize path and allow for the same route to have '/$' or not.
server.pre(restify.pre.sanitizePath());


// see ./routes
server.post({path: '/events/save',         version: '0.1.0'}, routes.saveEvent);
server.get( {path: '/events/report',       version: '0.1.0'}, routes.reportEvents);

// Go!
init.isCreated()
.then(function (reply) {
  if (!reply) {
   return init.create();
  }
})
.then(function (reply) {
  init.inspect();
})
.catch(function (err) {
  console.log(err);
});


var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('%s: Listening on: %s', server.name, server.url);
});
