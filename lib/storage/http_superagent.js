/*! http_superagent.js */

/**
 * This mixin implements a remote
 * [storage]{@linkcode storage}
 * feature which performs Ajax requests to a KagoDB
 * [webapi]{@linkcode KagoDB#webapi}
 * server via
 * [superagent]{@link https://npmjs.org/package/superagent} module.
 *
 * This would be also useful when testing your webapi using
 * [supertest]{@link https://npmjs.org/package/supertest} module,
 * as it contains superagent.
 *
 * Web browser build of superagent is also available.
 *
 * @class http_superagent
 * @mixin
 * @see https://raw.github.com/visionmedia/superagent/master/superagent.js
 * @see https://npmjs.org/package/superagent
 *
 * @example
 * var opts = {
 *   storage: 'http_superagent',
 *   endpoint: 'http://localhost:3000/data/'
 * };
 *
 * var collection = new KagoDB(opts);
 *
 * collection.read('foo', function(err, item){
 *   // http://localhost:3000/data/foo
 * });
 *
 * @example
 * var express = require('express');
 * var supertest = require('supertest');
 *
 * var app = express();
 * var server_opts = {
 *   storage: 'memory'
 * };
 * app.all('/data/:id?', KagoDB(server_opts).webapi());
 *
 * var client_opts = {
 *   storage: 'http_superagent',
 *   endpoint: '/data/',
 *   superagent: supertest(app)
 * };
 *
 * var collection = new KagoDB(client_opts);
 * var item = {
 *   bar: 'buz'
 * };
 * collection.write('foo', item, function(err) {
 *   collection.read('foo', function(err, item) {
 *     console.log(item); // => { bar: 'buz' }
 *   });
 * });
 */

var http_base = require('../mixin/http_base');
var request_superagent = require('../mixin/request_superagent');
var utils = require('../core/utils');

module.exports = function() {
  var http_mixin = http_base.call(this);
  var request_mixin = request_superagent.call(this);
  var mixin = {};
  utils.extend(mixin, http_mixin);
  utils.extend(mixin, request_mixin);
  return mixin;
};