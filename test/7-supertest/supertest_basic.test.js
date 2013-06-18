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

describe('Supertest Basic:', function() {
  var endpoint = '/memory/';
  var myagent = supertest(app);
  var opts = {
    storage: 'ajax',
    ajax: 'superagent',
    superagent: myagent,
    endpoint: endpoint
  };

  describe('CRUD', function() {
    var MyKago = KagoDB.inherit(opts);
    crud_tests(MyKago);
  });

  describe('Request', function() {
    var MyKago = KagoDB.inherit(opts);
    http_tests(MyKago);
  });
});
