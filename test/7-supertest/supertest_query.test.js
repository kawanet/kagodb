/*! supertest_query.test.js */

var KagoDB = require('../../index');
var supertest = require('supertest');
var express = require('express');

var DEBUG = false;

function SuperTestKagoDB(opts) {
  if (!(this instanceof SuperTestKagoDB)) return new SuperTestKagoDB(opts);

  var app = express();
  var server_collection = new KagoDB(opts);
  app.all('/api/:id?', server_collection.webapi());

  if (DEBUG) server_collection.on('webapi', console.error);
  if (DEBUG) server_collection.on('warn', console.error);

  var client_opts = {
    storage: 'http_superagent',
    superagent: supertest(app),
    endpoint: '/api/'
  };

  KagoDB.call(this, client_opts);

  this.on('request', function(req) {
    if (DEBUG) console.error('request', req.method, req.url, req.data || req._data || req.form);
  });
}

KagoDB.bundle.utils.inherits(SuperTestKagoDB, KagoDB);

exports.DONT_RUN_TESTS_ON_REQUIRE = true;

describe('Supertest Queries:', function() {
  require('../4-query/find.test')(SuperTestKagoDB);
  require('../4-query/findAndModify.test')(SuperTestKagoDB);
  require('../4-query/insert.test')(SuperTestKagoDB);
  require('../4-query/remove.test')(SuperTestKagoDB);
  require('../4-query/save.test')(SuperTestKagoDB);
  require('../4-query/update.test')(SuperTestKagoDB);
});