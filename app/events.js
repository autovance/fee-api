"use strict";
var item = require('./transactions').item,
  list = require('./transactions').list,
  moment = require('moment'),
  stripe = require('stripe')(process.env.STRIPE_KEY);

// Model interactions

module.exports = {

  save: function (trans) {
    var time = moment(trans.created);

    console.log(trans);

    stripe.balance.retrieveTransaction(
      trans.data.object.balance_transaction,
      function(err, balanceTransaction) {
        if (err) {
          console.log(err);
        }

        console.log(balanceTransaction);
      }
    );

    return true;
  },

  report: function () {

  }

};