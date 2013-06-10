/*! model.js */

var utils = require('../core/utils');

/** This mixin provides model() method in addition to overriding read() method to install a primary key feature.
 * @class ModelClassMixin
 * @mixin
 */

module.exports = function(default_model) {
  return mixin;

  function mixin() {
    var _read = this.read || no_read;

    /** This gets or sets a primary key. Use this interface to change a primary key after a session started.
     * @method PkeyMixin.prototype.model
     * @param {String} model - primary key to set
     * @returns {String} primary key
     * @example
     * var KagoDB = require('KagoDB');
     * var Item = require('./model/item');
     * var collection = new KagoDB();
     * collection.model(Item); // => Item
     * collection.model(); // => Item
     * collection.get('model'); // => Item
     */

    this.model = function(model) {
      if (arguments.length == 1) {
        this._model = model;
        this.set('model', model);
        return model;
      }
      model = this._model;
      if (!model && model !== null) {
        model = this._model = this.get('model') || default_model || null;
      }
      return model;
    };

    this.read = function(id, next) {
      var model = this._model || this.model();
      var callback = model ? after_read : next;
      _read.call(this, id, callback);

      function after_read(err, item) {
        if (!err && 'object' == typeof item) {
          item = utils.bless(item, model);
        }
        next(err, item);
      }
    };
  }
};

function no_read(id, callback) {
  throw new Error('method not implemented: read');
}