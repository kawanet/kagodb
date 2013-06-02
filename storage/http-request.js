/*! http-request.js */

var request = require('request');
var proxy_base = require('./http-base');

module.exports = function() {
  var mixin = proxy_base.apply(this, arguments);
  mixin.proxy_request = proxy_request;
  return mixin;
};

function proxy_request(opts, callback) {
  request(opts, function(err, response, body) {
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