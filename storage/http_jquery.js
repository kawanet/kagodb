/*! http_jquery.js */

/**
 * This mixin implements a remote
 * [storage]{@linkcode storage}
 * feature which performs Ajax requests to a KagoDB
 * [webapi]{@linkcode KagoDB#webapi}
 * server via
 * [jQuery]{@link http://jquery.com}
 * library.
 * On web browser environments, jQuery library must be loaded before loading KagoDB.
 *
 * @class http_jquery
 * @mixin
 * @see http://jquery.com
 * @see https://npmjs.org/package/jquery
 * @example
 * var opts = {
 *   storage: 'http_jquery',
 *   endpoint: 'http://localhost:3000/data/'
 * };
 *
 * var collection = new KagoDB(opts);
 *
 * collection.read('foo', function(err, item){
 *   // item =>  http://localhost:3000/data/foo
 * });
 */

var http_base = require('../storage/http_base');
var request_jquery = require('../mixin/request_jquery');
var utils = require('../core/utils');

module.exports = function() {
  var http_mixin = http_base.call(this);
  var request_mixin = request_jquery.call(this);
  var mixin = {};
  utils.extend(mixin, http_mixin);
  utils.extend(mixin, request_mixin);
  return mixin;
};