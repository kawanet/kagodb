/*! http_request.js */

var request = require('request');
var http_base = require('../core/http_base');

module.exports = function() {
  var mixin = http_base.call(this);
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
