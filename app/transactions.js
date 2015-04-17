"use strict";
var _ = require('lodash');

// Transaction Models

function Transaction() {
  this.time = null;
  this.date = null;
  this.price = null;
  this.name = null;
}

function TransactionList() {
  this.transactions = [];
}

TransactionList.prototype.sum = function () {
  var sum = 0;

  _.forEach(this.transactions, function (trans) {
    sum += trans.price;
  });

  return sum;
}

module.exports = {
  list = TransactionList,
  item = Transaction
};