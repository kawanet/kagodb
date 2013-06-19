/*! stub.js */

/**
 * This mixin provides a series of stub methods which will be overrided by runtime [storage]{@linkcode storage}.
 *
 * @class stub
 * @mixin
 */

module.exports = function(methods) {
  methods = methods || {};

  return function() {
    for (var method in methods) {
      // ignore method already exist
      if (this[method]) continue;

      // install a stub method
      this[method] = not_implemented(method);
    }
  };
};

function not_implemented(method) {
  return function() {
    throw new Error('method not implemented: ' + method);
  };
}
