/*! supertest_ajax.test.js */

var KagoDB = require('../../index');
var supertest = require('supertest');
var crud_tests = require('../testlib/crud_tests');
var http_tests = require('../testlib/http_tests');
var express = require('express');

var app = express();
var opts = {
  storage: 'memory'
};
app.all('/memory/:id?', KagoDB(opts).webapi());

describe('HTTP Storage: (supertest)', function() {
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

  describe('Request', function() {
    var kit = {};
    kit.collection = new KagoDB(opts);
    http_tests(kit);
  });
});
