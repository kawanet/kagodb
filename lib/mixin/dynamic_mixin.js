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

var intercept_mixin = require('../mixin/intercept_mixin');

module.exports = function(routing) {
  var _routing = '_' + routing + '_dynamic_mixin';
  return mixin;

  function mixin() {
    return intercept_mixin.call(this, wrapper);
  }

  function wrapper(method, defaultFunction) {
    return function() {
      var mixin = this[_routing];
      if (!mixin) {
        mixin = dynamic_loader.call(this, routing);
        if (mixin) this[_routing] = mixin;
      }
      var func = mixin && mixin[method] || defaultFunction;
      return func.apply(this, arguments);
    };
  }
};

function dynamic_loader(routing) {
  var mixin = this.get(routing);
  if (!mixin) {
    // throw new Error(routing + ' not specified');
    return null;
  }

  this.emit('dynamic_mixin', routing, mixin);

  var str = mixin + '';
  if ('function' != typeof mixin) {
    var preloaded = this.bundle || {};
    mixin = preloaded[str];
    if (!mixin) {
      throw new Error('invalid ' + routing + ' class: ' + str);
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

  return mixin;
}
