/*! http_superagent_app.test.js */

var assert = require('chai').assert;
var KagoDB = require('../index');
var supertest = require('supertest');
var crud_tests = require('./lib/crud_tests');
var express = require('express');

var app = express();
var opts = {
  storage: 'memory'
};
app.all('/memory/:id?', KagoDB(opts).webapi());

describe('HTTP (emulation) tests via supertest', function() {
  var endpoint = '/memory/';
  var myagent = supertest(app);
  var opts = {
    storage: 'http_superagent',
    endpoint: endpoint,
    superagent: myagent
  };

  describe('CRUD', function() {
    var kit = {};
    beforeEach(function() {
      kit.collection = new KagoDB(opts);
    });
    crud_tests(kit);
  });
});