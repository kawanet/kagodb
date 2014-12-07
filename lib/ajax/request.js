/*! request.js */

var request; // = require('request'); // lazy load

/**
 * This mixin provides
 * [ajax()]{@linkcode KagoDB#ajax}
 * method to perfome Ajax with
 * [request]{@link https://npmjs.org/package/request} module.
 *
 * Use
 * {@linkcode jquery}
 * mixin instead when you use Ajax from web browsers.
 *
 * @class request
 * @mixin
 * @see https://npmjs.org/package/request
 * @example
 * var MyKago = KagoDB.inherit();
 * MyKago.mixin(KagoDB.bundle.request());
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

var exports = module.exports = function() {
  var mixin = {
    ajax: exports.ajax
  };
  return mixin;
};

exports.ajax = function(opts, callback) {
  var self = this;
  if (self.emit) self.emit('ajax', opts);
  if (self.emit) self.emit('request', opts);

  // lazy load
  request = request || require('request');

  // perform a HTTP request
  request(opts, function(err, response, body) {
    if (self.emit) self.emit('response', response);
    if (response.statusCode >= 400) {
      return callback(response.statusCode);
    }
    if (!err && 'string' == typeof body && body.length) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        err = e;
      }
    }
    callback(err, body);
  });
};
