"use strict";

var redis = require('redis'),
  moment = require('moment'),
  redisClient = require('./transactions').client,
  when = require('when');

// Redis initialization and management

module.exports = {

  isCreated: function () {
    var promise;

    promise = when.promise(function (resolve, reject) {
      redisClient.get('tkey', function (err, reply) {

        if (err || reply === null) {
          resolve(false);
        }

        resolve(true);
      });
    });

    return promise;
  },

  create: function () {
    var promise;

    promise = when.promise(function (resolve, reject) {
      redisClient.set('tkey', -1, function (err, reply) {

        if (err || reply === null) {
          reject(err);
        }

        resolve(reply);
      });
    });

    return promise;
  },

  destroy: function () {
    var promise;

    promise = when.promise(function (resolve, reject) {
      redisClient.flushdb(function (err, reply) {
        if (err || reply === null) {
          reject(err);
        }

        if (reply) {
          resolve(reply);
        }

        reject(reply);
      });
    });

    return promise;
  },

  inspect: function () {

    redisClient.lrange(moment().isoWeek(), 0, -1, function (err, reply) {
      if (err) {
        console.log('week list error!');
        console.log(err);

        redisClient.type(moment().isoWeek(), function (err, reply) {
          console.log(reply);
        });
        redisClient.del(moment().isoWeek(), function (err, reply) {
          console.log('deleted list in response. (' + reply + ' del)');
        })
      }
      console.log('this weeks list: ' + reply);
    });
    redisClient.get('tkey', function (err, reply) {
      if (err) {
        console.log('transaction key error: ');
        console.log(err);
      }
      console.log('current transaction key: ' + reply);
    });

    redisClient.keys('*', function (err, reply) {
      if (err) {
        console.log(err);
      }
      console.log('keys: ' + reply);
    });

  }

};