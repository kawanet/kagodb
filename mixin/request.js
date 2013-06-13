/*! request.js */

var request = require('request');

/**
 * This mixin provides request() method to perfome Ajax.
 * Use request_jquery mixin instead when you call request() on web browsers.
 *
 * @class request
 * @mixin
 */

module.exports = function() {
  var mixin = {
    request: _request
  };
  return mixin;
};

/**
 * This performs a HTTP request.
 * This works with mikeal's request module per default.
 *
 * @method KagoDB.prototype.request
 * @param {Object} options - parameters: method, url, json, form
 * @param {Function} callback - function(err, body) {}
 * @returns {KagoDB} itself for method chaining
 * @see https://github.com/mikeal/request
 * @example
 * var MyKago = KagoDB.inherit();
 * MyKago.mixin(KagoDB.bundle.request());
 * var collection = new MyKago();
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