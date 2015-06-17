"use strict";

var events = require('./events'),
  moment = require('moment'),
  handlebars = require('handlebars'),
  fs = require('fs'),
  path = require('path'),
  sendgrid  = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASS),
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

    if(req.headers.apikey !== process.env.API_SECRET && req.headers.apikey !== undefined) {
      res.status(401);
      res.end();
      return next();
    }

    var isEmail = req.query.email || false;
    var slist;

    events.report()
    .then(function (list) {
      slist = list;

      _.forEach(list.transactions, function (item) {
        item.dollar = (item.amount/100).toFixed(2);
        delete item.client;
      });

      list.sum()
      .then(function (resp) {

        if (isEmail) {
          var payload = new sendgrid.Email({
            to: process.env.EMAIL_RECIPIENT,
            from: process.env.EMAIL_SENDER,
            subject: '[Fee API] Stripe Fee Report'
          });

          fs.readFile('.' /*+ path.dirname(process.mainModule.filename)*/ + '/app/emailtemplate/index.hbs', 'utf-8',
            function (err, template) {
              if (err) { console.log(err); throw err; }


              var rendered = handlebars.compile(template)({
                message: {
                  name: 'Stripe Fee Reporting',
                  description: 'Here is a list of all of the fee\'s that were collected this week.',
                  vendor: 'Stripe Payments Platform',
                  list: slist.transactions,
                  total: (resp/100).toFixed(2)
                }
              });

              payload.setHtml(rendered);
              sendgrid.send(payload, function (err) {
                if (err) {return console.error(err); isEmail = false;}
              });

              res.json({message: 'success', week: 'w' + moment().isoWeek(), transList: list.transactions, sum: resp, emailSent: isEmail});
              res.end();
            }
          );
        } else {
          res.json({message: 'success', week: 'w' + moment().isoWeek(), transList: list.transactions, sum: resp, emailSent: isEmail});
          res.end();
        }

      });
    });

    return next();
  }

};