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