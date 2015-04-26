"use strict";
var item = require('./transactions').item,
  list = require('./transactions').list;

// Model interactions

module.exports = {

  save: function (trans) {

    console.log(trans);

    stripe.balance.retrieveTransaction(
      trans.data.object.balance_transaction,
      function(err, balanceTransaction) {
        console.log(balanceTransaction);
      }
    );

    return true;
  },

  report: function () {

  }

};