"use strict";
var sinon = require('sinon'),
  expect = require('chai').expect,
  sinonAsPromised = require('sinon-as-promised'),
  _ = require('lodash'),
  when = require('when'),

  //related
  moment = require('moment'),
  redis = require('redis'),
  init = require('../app/init'),

  //testing
  Transactions = require('../app/transactions');


describe("Transaction Models", function (done) {
  var redisClient, list, item;

  beforeEach(function () {
    init.create();
    redisClient = redis.createClient();
    list = new Transactions.list(redisClient);
    item = new Transactions.item(redisClient);
  });

  afterEach(function () {
    list = null;
    item = null;
    redisClient.quit();
    init.destroy();
  });

  describe('Transaction', function (done) {

    describe('Save', function (done) {

      it('should reject if the transaction details are not set', function (done) {
        item.save()
        .catch(function (err) {
          done();
        });
      });

      it('should increment the transaction key', function (done) {

        redisClient.get('tkey', function (err, reply) {
          item.date = moment().format('YYYY.MM.DD');
          item.time = moment().format('HH:SS');
          item.name = 'Test Transaction';
          item.price = '33.44';

          item.save()
          .then(function () {
            redisClient.get('tkey', function (err, value) {
              expect(+value).to.equal(1);
              done();
            });
          });
        });
      });

      it('should push the transaction key to a list labeled for this week', function (done) {

        item.date = moment().format('YYYY.MM.DD');
        item.time = moment().format('HH:SS');
        item.name = 'Test Transaction';
        item.price = '33.44';

        item.save()
        .then(function () {
          redisClient.lrange(moment().isoWeek(), 0, -1, function (err, reply) {
            expect(reply).to.eql(['0']);
            done();
          });
        });
      });

      it('should set a hash key representing a transaction', function (done) {
        item.date = moment().format('YYYY.MM.DD');
        item.time = moment().format('HH:SS');
        item.name = 'Test Transaction';
        item.price = '33.44';

        item.save()
        .then(function () {
          redisClient.lrange(moment().isoWeek(), 0, -1, function (err, reply) {
            redisClient.hgetall(reply[0], function (err, reply) {
              expect(reply).to.eql({
                key: "0",
                date: item.date,
                time: item.time,
                name: item.name,
                price: item.price
              });
              done();
            });
          });
        });
      });
    });
  });

  describe('TransactionList', function (done) {

    describe('save', function (done) {

      it('should save a list of transactions', function (done) {
        var item1 = new Transactions.item(),
          item2 = new Transactions.item();

        item1.date = moment().format('YYYY.MM.DD');
        item1.time = moment().format('HH:SS');
        item1.name = 'Test Transaction';
        item1.price = '33.44';

        item2.date = moment().format('YYYY.MM.DD');
        item2.time = moment().format('HH:SS');
        item2.name = 'Test Transaction';
        item2.price = '33.44';

        list.transactions[0] = item1;
        list.transactions[1] = item2;

        list.save()
        .then(function (reply) {

          redisClient.lrange(moment().isoWeek(), 0, -1, function (err, reply) {
            expect(reply).to.eql(['0', '1']);
            done();
          });
        });
      });

    });

    describe('fetch', function (done) {

      it('should fetch a list representing a week', function (done) {
        var check, item1 = new Transactions.item(),
          item2 = new Transactions.item();

        item1.date = moment().format('YYYY.MM.DD');
        item1.time = moment().format('HH:MM');
        item1.name = 'Test Transaction';
        item1.price = '33.44';

        item2.date = moment().format('YYYY.MM.DD');
        item2.time = moment().format('HH:MM');
        item2.name = 'Test Transaction';
        item2.price = '33.45';

        list.transactions[0] = item1;
        list.transactions[1] = item2;

        list.save()
        .then(function () {
          list.transactions[0].key = "0";
          list.transactions[1].key = "1";
          check = list.transactions;
          list.transactions = [];
          return list.fetch(moment().isoWeek());
        })
        .then(function (reply) {
          if (reply) {
            expect(list.transactions).to.eql(check);
            done();
          }
        });
      });
    });

    describe('sum', function (done) {

      it('should sum the prices accurately', function (done) {
        var check, item1 = new Transactions.item(),
          item2 = new Transactions.item();

        item1.date = moment().format('YYYY.MM.DD');
        item1.time = moment().format('HH:MM');
        item1.name = 'Test Transaction';
        item1.price = '33.44';

        item2.date = moment().format('YYYY.MM.DD');
        item2.time = moment().format('HH:MM');
        item2.name = 'Test Transaction';
        item2.price = '33.45';

        list.transactions[0] = item1;
        list.transactions[1] = item2;

        list.sum()
        .then(function (reply) {
          expect(reply).to.equal((+item1.price) + (+item2.price));
          done();
        });
      });
    });
  });
});