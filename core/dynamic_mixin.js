/*! dynamic_mixin.js */

/**
 * This mixin provides a dynamic mixin loader which awakes at the first time when the methods called.
 *
 * @class dynamic_mixin
 * @mixin
 * @example
 * var MyKago = KagoDB.inherit();
 *
 * var hello_mixin = {
 *   hello: function() {
 *     console.log('world!');
 *   }
 * };
 *
 * var dynamic_mixin = KagoDB.bundle.dynamic_mixin;
 * MyKago.mixin(dynamic_mixin('keyname'));
 * MyKago.bundle.hello_mixin = hello_mixin;
 *
 * var opts = {
 *   storage: 'memory',
 *   keyname: 'hello_mixin'
 * };
 *
 * var collection = new MyKago(opts);
 * collection.noop(); // abrakadabra
 * collection.hello(); // => 'world!'
 */

var intercept_mixin = require('../core/intercept_mixin');

module.exports = function(name) {
  return mixin;

  function mixin() {
    return intercept_mixin.call(this, wrapper);
  }

  function wrapper(key, func) {
    return function() {
      // load a mixin
      var mixin = dynamic_loader.call(this, name) || {};
      func = mixin[key] || func;
      return func.apply(this, arguments);
    };
  }
};

function dynamic_loader(name) {
  var _name = '_' + name;
  var mixin = this[_name];

  // already loaded
  if (mixin) {
    return mixin;
  }

  mixin = this.get(name);
  if (!mixin) {
    throw new Error(name + ' not specified');
  }

  var str = mixin + '';
  if ('function' != typeof mixin) {
    var preloaded = this.bundle || {};
    mixin = preloaded[str];
    if (!mixin) {
      throw new Error('invalid ' + name + ' class: ' + str);
    }
  }

  // emulate mixin's recursive call
  while ('function' == typeof mixin) {
    mixin = mixin.call(this);
  }

  // install new methods
  for (var key in mixin) {
    if (!this[key]) {
      this[key] = mixin[key];
    }
  }

  this[_name] = mixin;
  return mixin;
}