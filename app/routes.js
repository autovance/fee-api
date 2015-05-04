"use strict";
var events = require('./events'),
  moment = require('moment'),
  handlebars = require('handlebars'),
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
    var isEmail = req.query.email || false;
    var slist;

    events.report()
    .then(function (list) {

      _.forEach(list.transactions, function (item) {
        delete item.client;
      });

      slist = list;

      list.sum()
      .then(function (resp) {

        if (isEmail) {
          var payload = new sendgrid.Email({
            to: process.env.EMAIL_RECIPIENT,
            from: 'no-reply@autovance.com',
            subject: '[Autovance] Stripe Fee Report'
          });

          fs.readFile(path.dirname(process.mainModule.filename) + './emailtemplate/index.hbs', 'utf-8',
            function (err, template) {
              if (err) { throw err; }

              var rendered = handlebars.compile(template)({
                message: {
                  name: 'Stripe Fee Reporting',
                  description: 'Here is a list of all of the fee\'s that were collected this week.',
                  vendor: 'Stripe Payments Platform',
                  list: list,
                  total: resp
                }
              });

              payload.setHtml(rendered);
              sendgrid.send(payload, function (err) {
                if (err) {return console.error(err); }
              });
            }
          );
        }

        res.json({message: 'success', week: 'w' + moment().isoWeek(), transList: list.transactions, sum: resp, emailSent: isEmail});
        res.end();
      });
    });

    return next();
  }

};