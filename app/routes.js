"use strict";
var events = require('./events'),
  moment = require('moment'),
  _ = require('lodash');

// Manual interaction with the scheduled functions

module.exports = {

  saveEvent: function (req, res, next) {

    events.save(req.body)
    .catch(function (er) {
      console.log(er);
      res.status(500);
      res.end();
    })
    .then(function () {
      res.status(200);
      res.end();
    });


    return next();
  },

  reportEvents: function (req, res, next) {

    events.report()
    .then(function (list) {

      _.forEach(list.transactions, function (item) {
        delete item.client;
      });

      res.json({message: 'success', week: moment().isoWeek(), transList: list.transactions, sum: list.sum()});
      res.end();
    })

    return next();
  }

};