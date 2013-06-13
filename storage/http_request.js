/*! http_request.js */

/**
 * This mixin provides a remote storage feature which performs Ajax requests to a KagoDB webapi server via request module.
 *
 * @class http_request
 * @mixin
 * @see https://npmjs.org/package/request
 * @example
 * var opts = {
 *   storage: 'http_request',
 *   endpoint: 'http://localhost:3000/data/'
 * };
 *
 * var collection = new KagoDB(opts);
 *
 * collection.read('foo', function(err, item){
 *   // http://localhost:3000/data/foo
 * });
 */

var http_base = require('../core/http_base');
var request = require('../mixin/request');
var utils = require('../core/utils');

module.exports = function() {
  var http_mixin = http_base.call(this);
  var request_mixin = request.call(this);
  var mixin = {};
  utils.extend(mixin, http_mixin);
  utils.extend(mixin, request_mixin);
  return mixin;
};
