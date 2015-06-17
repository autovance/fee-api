"use strict";
var Item = require('./transactions').item,
  List = require('./transactions').list,
  moment = require('moment'),
  _ = require('lodash'),
  when = require('when'),
  stripe = require('stripe')(process.env.STRIPE_KEY);

// Model interactions

module.exports = {

  save: function (trans) {
    var promise, actions = [], list = new List();



    promise = when.promise(function (resolve, reject) {

      stripe.balance.retrieveTransaction(
        trans.data.object.balance_transaction,
        function(err, balanceTransaction) {

          if (err) {
            console.log(err);
            reject(err);
            return false;
          }

          var date = moment.unix(balanceTransaction.available_on).format('YYYY.MM.DD'),
              time = moment.unix(balanceTransaction.available_on).format('HH:MM');

          _.forEach(balanceTransaction.fee_details, function (fee) {
            var obj;

            obj = {
              date: date,
              time: time,
              name: trans.data.object.source.name,
              amount: fee.amount
            };

            list.transactions.push(new Item(obj));
          });

          list.save()
          .catch(function (err) {
            reject(err);
          })
          .then(function (reply) {
            resolve(reply);
          });
        }
      );

    });

    return promise;
  },

  report: function () {
    var promise, list, dlist, week = moment().isoWeek();

    dlist = new List();
    list = new List();

    // delete a set number of weeks behind the current
    dlist.delete('w' + (week - process.env.DELETE_THRESHOLD));

    return list.fetch(week)
    .then(function (result) {
      return list;
    });
  }

};
