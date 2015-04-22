"use strict";

var redis = require('redis'),
  when = require('when');

// Redis initialization and management

module.exports = {

  isCreated: function () {
    var promise, client = redis.createClient();

    promise = when.promise(function (resolve, reject) {
      client.get('tkey', function (err, reply) {

        if (err || reply === null) {
          client.quit();
          reject(false);
        }

        client.quit();
        resolve(true);
      });
    });

    return promise;
  },

  create: function () {
    var promise, client = redis.createClient();

    promise = when.promise(function (resolve, reject) {
      client.set('tkey', -1, function (err, reply) {

        if (err || reply === null) {
          client.quit();
          reject(false);
        }

        client.quit();
        resolve(reply);
      });
    });

    return promise;
  },

  destroy: function () {
    var promise, client = redis.createClient();

    promise = when.promise(function (resolve, reject) {
      client.flushdb(function (err, reply) {
        if (err || reply === null) {
          client.quit();
          reject(err);
        }

        if (reply) {
          client.quit();
          resolve(reply);
        }

        client.quit();
        reject(reply);
      });
    });

    return promise;
  }

};