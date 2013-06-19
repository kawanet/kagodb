/*! dynamic_ajax.js */

/**
 * This mixin provides a dynamic ajax driver dispatching mechanism.
 *
 * @class dynamic_ajax
 * @mixin
 */

var stub = require('../mixin/stub');
var dynamic_mixin = require('../mixin/dynamic_mixin');

var methods = {
  ajax: 1
};

module.exports = function() {
  return mixin;

  function mixin() {
    stub(methods).call(this);
    return dynamic_mixin('ajax');
  }
};

/**
 * This performs a HTTP request.
 *
 * @method KagoDB.prototype.ajax
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
 * collection.ajax(options, function(err, body) {
 *   console.log(body); // JSON
 * });
 */
