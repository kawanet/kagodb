/*! http-request.js */

var utils = require('../core/utils');
var request = require('request');
var ProxyBase = require('./http-base');

module.exports = utils.inherits(ProxyRequest, ProxyBase);

function ProxyRequest(options) {
  if (!(this instanceof ProxyRequest)) return new ProxyRequest(options);
  this.options = options || {};
}

ProxyRequest.prototype.request = function(opts, callback) {
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
};