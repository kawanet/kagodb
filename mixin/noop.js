/*! noop.js */

/** This mixin provides noop() method which does no operation.
 * @class NoopMixin
 * @mixin
 */

/** This does no operation.
 * @method NoopMixin.prototype.noop
 * @returns {KagoDB} itself for method chaining
 */

module.exports = function(default_pkey) {
  return {
    noop: function() {
      return this;
    }
  };
};