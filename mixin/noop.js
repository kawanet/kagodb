/*! noop.js */

/**
 * This mixin provides noop() method which does no operation.
 *
 * @class noop
 * @mixin
 */

/**
 * This does no operation per default.
 *
 * @method KagoDB.prototype.noop
 * @returns {KagoDB} itself for method chaining
 * @example
 * var collection = new KagoDB({storage: 'json'});
 * collection.noop().noop().noop().noop(); // does nothing four times
 */

module.exports = function(default_pkey) {
  return {
    noop: function() {
      return this;
    }
  };
};