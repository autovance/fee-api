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
    var promise, list = new List();

    promise = when.promise(function (resolve, reject) {

      console.log(trans.data.object.source);

      stripe.balance.retrieveTransaction(
        trans.data.object.balance_transaction,
        function(err, balanceTransaction) {
          if (err) {
            console.log(err);
            reject(err);
            return false;
          }

          var date = moment(balanceTransaction.available_on).format('YYYY-MM-DD'),
              time = moment(balanceTransaction.available_on).format('HH:MM')

          _.forEach(balanceTransaction.fee_details, function (fee) {
            var item = new Item({
              date: date,
              time: time,
              name: fee.description,
              amount: fee.amount
            });

            list.transactions.push(item);
          });

          list.save()
          .then(function (reply) {
            resolve(reply);
          })
          .catch(function (err) {
            reject(err);
          });
        }
      );

    });

    return promise;
  },

  report: function () {
    var promise, list = new List(), week = moment.isoWeek();

    list.fetch(week)
    .then(function (reply) {
      console.log(reply);
      console.log(list.transacions);
    });
  }

};