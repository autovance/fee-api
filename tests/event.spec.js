"use strict";
var demand = require('chai').expect,
  Transactions = require('../app/transactions'), 
  moment = require('moment'),
  events = require('../app/events');

describe('Events', function (done) {


  describe('save', function (done) {

  });

  describe('report', function (done) {

    before(function (done) {
      var check, list = new Transactions.list(),
          item1 = new Transactions.item(),
          item2 = new Transactions.item();

      item1.date = moment().format('YYYY.MM.DD');
      item1.time = moment().format('HH:MM');
      item1.name = 'Test Transaction';
      item1.amount = '33.44';

      item2.date = moment().format('YYYY.MM.DD');
      item2.time = moment().format('HH:MM');
      item2.name = 'Test Transaction';
      item2.amount = '33.45';

      list.transactions[0] = item1;
      list.transactions[1] = item2;

      list.save()
      .then(function () {
        list.transactions[0].key = "0";
        list.transactions[1].key = "1";
        check = list.transactions;
        list.transactions = [];

        done();
      });
    });


    it('should fetch a list', function (done) {

      events.report()
      .then(function (result) {
        demand(result.transactions).to.have.length(2);
        done();
      });
    });
  });
});