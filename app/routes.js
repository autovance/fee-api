"use strict";
var events = require('./events');

// Manual interaction with the scheduled functions

module.exports = {

  saveEvent: function (req, res, next) {
    events.save(req.body);

    res.write('{message: ', 'utf-8');
    res.write('"success"}', 'utf-8');

    res.end();
    return next();
  },

  reportEvents: function (req, res, next) {

  }

};