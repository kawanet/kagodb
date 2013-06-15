/*! request_superagent.js */

var wrequire = require('wrequire');

/**
 * This mixin provides request() method whish works with superagent.
 * This would be useful when you run tests using supertest.
 *
 * @class request_superagent
 * @mixin
 * @see https://github.com/visionmedia/superagent
 * @example
 * var MyKago = KagoDB.inherit();
 * MyKago.mixin(KagoDB.bundle.request_superagent());
 * var collection = new MyKago();
 *
 * var options = {
 *   method: 'GET',
 *   url: 'http://graph.facebook.com/4',
 * };
 * collection.request(options, function(err, body) {
 *   console.log(body); // JSON
 * });
 */

module.exports = function() {
  var mixin = {
    request: request
  };
  return mixin;
};

function request(opts, callback) {
  var self = this;
  var method = opts.method || 'GET';
  var url = opts.url;
  var superagent = this.get('superagent');
  superagent = superagent || wrequire('superagent', 'superagent');
  if (!superagent) throw new Error('superagent not loaded');

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
}