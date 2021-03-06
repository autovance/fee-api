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
    item = new Transactions.item(null, redisClient);
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
          item.set({
            date: moment().format('YYYY.MM.DD'),
            time: moment().format('HH:SS'),
            name: 'Test Transaction',
            amount: '33.44'
          });

          item.save()
          .then(function () {
            redisClient.get('tkey', function (err, value) {
              expect(+value).to.equal(0);
              done();
            });
          });
        });
      });

      it('should push the transaction key to a list labeled for this week', function (done) {

        item.date = moment().format('YYYY.MM.DD');
        item.time = moment().format('HH:SS');
        item.name = 'Test Transaction';
        item.amount = '33.44';

        item.save()
        .then(function () {
          redisClient.lrange('w' + moment().isoWeek(), 0, -1, function (err, reply) {
            expect(reply).to.eql(['0']);
            done();
          });
        });
      });

      it('should set a hash key representing a transaction', function (done) {
        item.date = moment().format('YYYY.MM.DD');
        item.time = moment().format('HH:SS');
        item.name = 'Test Transaction';
        item.amount = '33.44';

        item.save()
        .then(function () {
          redisClient.lrange('w' + moment().isoWeek(), 0, -1, function (err, reply) {
            redisClient.hgetall(reply[0], function (err, reply) {
              expect(reply).to.eql({
                key: "0",
                date: item.date,
                time: item.time,
                name: item.name,
                amount: item.amount
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

        item1.set({
          date: moment().format('YYYY.MM.DD'),
          time: moment().format('HH:SS'),
          name: 'Test Transaction',
          amount: '33.44'
        });

        item2.set({
          date: moment().format('YYYY.MM.DD'),
          time: moment().format('HH:SS'),
          name: 'Test Transaction',
          amount: '33.45'
        });

        list.transactions[0] = item1;
        list.transactions[1] = item2;

        list.save()
        .then(function (reply) {

          redisClient.lrange('w' + moment().isoWeek(), 0, -1, function (err, reply) {
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

      it('should sum the amounts accurately', function (done) {
        var check, item1 = new Transactions.item(),
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

        list.sum()
        .then(function (reply) {
          expect(reply).to.equal((+item1.amount) + (+item2.amount));
          expect(reply).to.equal(33.44 + 33.45);
          expect(reply).to.equal(66.89);
          done();
        });
      });
    });

    describe('delete', function (done) {

      it('should delete a week and its keys', function (done) {
        var check, item1 = new Transactions.item(),
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
          list.delete(moment().isoWeek())
          .then(function () {
            redisClient.get('0', function (err, reply) {
              expect(reply).to.be.a('null');
              done();
            });
          });
        });
      });

      it('should not delete anything but the week specified', function (done) {
        var check, item1 = new Transactions.item(),
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
          list.delete('w' + (moment().isoWeek() - 1))
          .then(function () {
            redisClient.hgetall('0', function (err, reply) {

              console.log(reply);
              expect(reply).to.be.ok;
              done();
            });
          });
        });
      });
    });
  });
});