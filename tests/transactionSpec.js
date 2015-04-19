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
              expect(+value).to.equal((+reply) + 1);
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

      it.skip('should set a hash key representing a transaction', function (done) {
        done();
      });

    });

  });

  describe.skip('TransactionList', function (done) {

    describe('sum', function (done) {

    });

    describe('save', function (done) {

    });

    describe('fetch', function (done) {

    });

  });
});