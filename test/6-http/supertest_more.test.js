/*! supertest_more.test.js */

var KagoDB = require('../../index');
var supertest = require('supertest');
var express = require('express');

function SuperTestKagoDB(opts) {
  if (!(this instanceof SuperTestKagoDB)) return new SuperTestKagoDB(opts);

  var app = express();
  var server_collection = new KagoDB(opts);
  app.all('/api/:id?', server_collection.webapi());

  // server_collection.on('webapi', console.error);
  // server_collection.on('warn', console.error);

  var client_opts = {
    storage: 'http_superagent',
    superagent: supertest(app),
    endpoint: '/api/'
  };

  KagoDB.call(this, client_opts);
}

KagoDB.bundle.utils.inherits(SuperTestKagoDB, KagoDB);

exports.DONT_RUN_TESTS_ON_REQUIRE = true;

describe('Supertest:', function() {
  require('../4-condition/insert.test')(SuperTestKagoDB);
  require('../4-condition/save.test')(SuperTestKagoDB);
  require('../4-condition/update.test')(SuperTestKagoDB);
  require('../4-condition/remove.test')(SuperTestKagoDB);
});