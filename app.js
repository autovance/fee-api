"use strict";

var restify = require('restify'),
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
server.listen(3000, function () {
  console.log('%s: Listening on: %s', server.name, server.url);
});
