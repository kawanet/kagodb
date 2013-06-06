/*! intercept_mixin.js */

/**
 * This mixin intercepts all methods any other than get() and set().
 * @class InterceptMixin
 * @mixin
 * @param {Function} wrapper - function(method, defaultFunction){}
 * @return {Function} mixin function
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