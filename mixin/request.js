/*! request.js */

var request = require('request');

module.exports = function() {
  var mixin = {
    request: _request
  };
  return mixin;
};

function _request(opts, callback) {
  var self = this;

  // perform a HTTP request
  request(opts, function(err, response, body) {
    if (self.on) self.on('response', response);
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