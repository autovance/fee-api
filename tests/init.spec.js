"use strict";
var sinon = require('sinon'),
  expect = require('chai').expect,
  sinonAsPromised = require('sinon-as-promised'),
  _ = require('lodash'),
  when = require('when'),

  //related
  redis = require('redis'),
  client = redis.createClient(),

  //testing
  init = require('../app/init');

describe("Redis Init", function (done) {

  afterEach(function () {
    client.flushdb();
  });

  describe('isCreated', function (done) {

    it('should check to see if the redis database (keys key) has been created', function (done) {

      var promise = init.isCreated();

      promise.catch(function (result) {
        expect(result).to.be.false;
      })
      .then(function () {
        return when(client.set('tkey', 0));
      })
      .then(function () {
        return init.isCreated();
      })
      .then(function (result) {
        expect(result).to.be.true;
        done();
      });

    });
  });

  describe('create', function (done) {
    it('should create the tkey, the only required key', function (done) {

      var promise = init.create();

      promise.then(function (result) {
        expect(result).to.equal('OK');
        done();
      });
    });
  });

  describe('destroy', function (done) {
    it('should destroy the database', function (done) {
      init.destroy()
      .then(function (result) {
        expect(result).to.equal('OK');
        done();
      });
    });
  });

});