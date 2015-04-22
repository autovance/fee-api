"use strict";
var _ = require('lodash'),
  redis = require('redis'),
  when = require('when'),
  moment = require('moment'),
  redisClient = redis.createClient();

redisClient.auth(8NdtfFO1xb4zsnYw); //? probably needed

// Transaction Models

// incremental key to set the transaction id
// hashes to store the actual transactions
// lists with weekly keys to store the transactions keys
// report on the last weeks list .. still stores historical datanpm


function Transaction(obj, client) {
  this.client = client || redisClient;

  this.key = (obj) ? obj.key : null;
  this.date = (obj) ? obj.date : null;
  this.time = (obj) ? obj.time : null;
  this.name = (obj) ? obj.name : null;
  this.price = (obj) ? obj.price : null;
}

Transaction.prototype.save = function() {

  if (_.any([this.time, this.date, this.price, this.name], function (item) {
    return _.isEmpty(item);
  })) {
    return when.reject(new Error('Transaction fields must be set before saving.'));
  }

  var promise, multi = this.client.multi(),
    week = moment().isoWeek();

  promise = when.promise(function (resolve, reject) {
    this.client.incr('tkey', function (err, reply) {
      if (err || (reply === null)) reject(new Error('No trans key?'));

      this.key = reply;

      multi.incr('tkey');
      multi.hmset(this.key, {
        key: this.key,
        date: this.date,
        time: this.time,
        name: this.name,
        price: this.price
      });
      multi.rpush(week, this.key);

      multi.exec(function (err, replies) {
        if (err) {
          console.log('save trans ' + this.key + ': FAIL');
          reject(new Error(err));
          return false;
        }
        console.log('save trans ' + this.key + ': SUCCESS');
        resolve(replies);
        return true;
      }.bind(this));
    }.bind(this));
  }.bind(this));

  return promise;
}

function TransactionList(client) {
  this.client = client || redisClient;
  this.key = null;
  this.transactions = [];
}

TransactionList.prototype.sum = function () {
  var promise, sum = 0;

  promise = when.promise(function (resolve, reject) {
    _.forEach(this.transactions, function (trans) {
      sum += +trans.price;
    });
    resolve(sum);
  }.bind(this));

  return promise;
}

TransactionList.prototype.save = function () {
  var promise, actions = [];

  promise = when.promise(function (resolve, reject) {
    _.forEach(this.transactions, function (trans) {
      actions.push(trans.save());
    });

    when.all(actions)
    .then(resolve)
    .catch(reject);
  }.bind(this));

  return promise;

}

TransactionList.prototype.fetch = function (week) {
  var promise;
  this.transactions = [];

  promise = when.promise(function (resolve, reject) {
    this.client.lrange(week, 0, -1, function (err, replies) {
      if (err) reject(err);

      if (_.isEmpty(replies)) {
        resolve(false);
      }

      replies.forEach(function (reply, i) {

        this.client.hgetall(reply, function (err, reply) {
          if (err) reject(err);
          this.transactions.push(new Transaction(reply));
          resolve(true);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }.bind(this));

  return promise;
}

module.exports = {
  list: TransactionList,
  item: Transaction
};