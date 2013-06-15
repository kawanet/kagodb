/*! intercept_mixin.js */

/**
 * This mixin installs interceptor function for any existant methods other than
 * [get()]{@linkcode KagoDB#get} and
 * [set()]{@linkcode KagoDB#set}.
 *
 * @class intercept_mixin
 * @mixin
 * @example
 * function getWrapper(method, defaults) {
 *   console.error('wrapping:', method);
 *   return function() {
 *     console.error('called:', method, arguments[0]);
 *     defaults.apply(this, arguments);
 *   };
 * }
 *
 * var MyKago = KagoDB.inherit();
 * var intercept_mixin = KagoDB.bundle.intercept_mixin;
 * MyKago.mixin(intercept_mixin(getWrapper)); // => 'wrapping: read' etc.
 *
 * var opts = {
 *   storage: 'memory'
 * };
 * var collection = new MyKago(opts);
 * collection.read('foo'); // => 'called: read foo'
 */

module.exports = function(wrapper) {
  return mixin;

  function mixin() {
    var self = this;
    var backup = {};
    var key;
    var func;

    // search and backup current methods
    for (key in self) {
      // ignore _private properties including __super__
      if (key.substr(0, 1) == '_') continue;

      // ignore get/set basic methods
      if (key == 'get') continue;
      if (key == 'set') continue;

      // ignore non-method properties
      func = self[key];
      if ('function' !== typeof func) continue;

      // backup current function
      backup[key] = func;
    }

    // replace it with a wrap method
    for (key in backup) {
      self[key] = wrapper(key, backup[key]);
    }
  }
};