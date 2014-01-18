/*! model.js */

var utils = require('../core/utils');

/**
 * This mixin provides
 * [model()]{@linkcode KagoDB#model} method as well as model class feature which overrides
 * [read()]{@linkcode KagoDB#read} method to bless an item with the specified model class.
 *
 * This mixin must be loaded after [storage]{@linkcode storage} mixin or other storage-type mixins.
 *
 * @class model
 * @mixin
 * @example
 * function Item() {} // model class
 *
 * var opts = {
 *   storage: 'memory',
 *   model: Item
 * };
 * var collection = new KagoDB(opts);
 *
 * collection.write('foo', {}, function(err) {
 *   collection.read('foo', function(err, item){
 *     console.log(item instanceof Item); // => true
 *   })
 * });
 */

module.exports = function(default_model) {
  return mixin;

  function mixin() {
    var super_unwrap = this.unwrap;

    /** This gets or sets a model class.
     *
     * @method KagoDB.prototype.model
     * @param {String} model - model class to set
     * @returns {String} model class
     * @example
     * function Item() {} // model class
     *
     * var collection = new KagoDB();
     * collection.model(Item); // => setter
     * collection.model(); // => getter
     * collection.get('model'); // => getter
     *
     * collection.read(id, function(err, item){
     *   console.log(item instanceof Item); // => true
     * })
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

    this.unwrap = function(item) {
      var model = this._model || this.model();
      if (super_unwrap) {
        item = super_unwrap.call(this, item);
      }
      if (model) {
        item = utils.bless(item, model);
      }
      return item;
    };
  }
};

function no_read(id, callback) {
  throw new Error('method not implemented: read');
}
