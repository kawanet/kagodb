/*! superagent.js */

var wrequire = require('wrequire');

/**
 * This mixin provides
 * [ajax()]{@linkcode KagoDB#ajax}
 * method to perfome Ajax with
 * [superagent]{@link https://npmjs.org/package/superagent} module.
 *
 * This would be also useful when testing your webapi using
 * [supertest]{@link https://npmjs.org/package/supertest} module,
 * as it contains superagent.
 *
 * Web browser build of superagent is also available.
 *
 * @class superagent
 * @mixin
 * @see https://raw.github.com/visionmedia/superagent/master/superagent.js
 * @see https://npmjs.org/package/superagent
 *
 * @example
 * var MyKago = KagoDB.inherit();
 * MyKago.mixin(KagoDB.bundle.superagent());
 * var collection = new MyKago();
 *
 * var options = {
 *   method: 'GET',
 *   url: 'http://graph.facebook.com/4',
 * };
 * collection.ajax(options, function(err, body) {
 *   console.log(body); // JSON
 * });
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

var exports = module.exports = function() {
  var mixin = {
    ajax: exports.ajax
  };
  return mixin;
};

exports.ajax = function(opts, callback) {
  var self = this;
  var method = opts.method || 'GET';
  var url = opts.url;
  var superagent = this.get('superagent');
  superagent = superagent || wrequire('superagent', 'superagent');
  if (!superagent) throw new Error('superagent not loaded');
  if (self.emit) self.emit('ajax', opts);

  // create a HTTP request
  method = method.toLowerCase();
  method = method == 'delete' ? 'del' : method;
  var req = superagent[method](url);

  req.set('Accept', 'application/json');
  if (opts.json) {
    req.type('json').send(opts.json);
  } else if (opts.form) {
    if (method == 'get') {
      req.query(opts.form);
    } else {
      req.type('form').send(opts.form);
    }
  }
  if (self.emit) self.emit('request', req);

  // perform a HTTP request
  req.end(function(err, res) {
    if (self.emit) self.emit('response', res);
    if (err) {
      callback(err, res);
    } else {
      if (!res.ok) {
        err = new Error(res.status);
      }
      callback(err, res.body);
    }
  });
};
