/*! request.js */

var request; // = require('request'); // lazy load

/**
 * This mixin provides
 * [request()]{@linkcode KagoDB#request}
 * method to perfome Ajax with
 * [request]{@link https://npmjs.org/package/request} module.
 *
 * Use
 * {@linkcode request_jquery}
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

module.exports = function() {
  var mixin = {
    request: _request
  };
  return mixin;
};

/**
 * This performs a HTTP request.
 * This works with
 * [request]{@link https://npmjs.org/package/request}
 * module per default.
 *
 * @method KagoDB.prototype.request
 * @param {Object} options - parameters: method, url, json, form
 * @param {Function} callback - function(err, body) {}
 * @returns {KagoDB} itself for method chaining
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

function _request(opts, callback) {
  var self = this;
  if (self.emit) self.emit('request', opts);

  // lazy load
  request = request || require('request');

  // perform a HTTP request
  request(opts, function(err, response, body) {
    if (self.emit) self.emit('response', response);
    if (!err && 'string' == typeof body && body.length) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        err = e;
      }
    }
    callback(err, body);
  });
}