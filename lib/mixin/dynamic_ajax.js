/*! dynamic_ajax.js */

/**
 * This mixin provides a dynamic ajax driver dispatching mechanism.
 *
 * @class dynamic_ajax
 * @mixin
 */

var stub = require('../mixin/stub');
var wrequire = require('wrequire');
var dynamic_mixin = require('../mixin/dynamic_mixin');

var methods = {
  ajax: autoajax
};

module.exports = function() {
  return mixin;

  function mixin() {
    stub(methods).call(this);
    return dynamic_mixin('ajax');
  }
};

function autoajax() {
  if (!this._ajax) {
    if (this.bundle.superagent && this.get('superagent')) {
      // in a case "superagent" option specified
      this._ajax = this.bundle.superagent.ajax;
    } else if (this.bundle.jquery && (this.get('jquery') || wrequire('jQuery'))) {
      // in a case "jquery" option specified or "window.jQuery" global variable available (== browser)
      this._ajax = this.bundle.jquery.ajax;
    } else if (this.bundle.request) {
      // in a case bundle.request available (== node)
      this._ajax = this.bundle.request.ajax;
    }
  }
  if (this._ajax) {
    this._ajax.apply(this, arguments);
  } else {
    throw new Error('ajax driver is not specified at "ajax" option: ' + this.get('ajax'));
  }
}

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
