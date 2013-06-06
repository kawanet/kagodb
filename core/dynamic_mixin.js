/*! dynamic_mixin.js */

/**
 * This mixin load a mixin when methods has been called.
 * @class DynamicMixin
 * @mixin
 * @param {Object} opts - options
 * @return {Function} mixin function
 */

var intercept_mixin = require('../core/intercept_mixin');

module.exports = function(opts) {
  return mixin;

  function mixin() {
    return intercept_mixin.call(this, wrapper);
  }

  function wrapper(key, func) {
    return function() {
      // load a mixin
      var mixin = dynamic_loader.call(this, opts) || {};
      func = mixin[key] || func;
      return func.apply(this, arguments);
    };
  }
};

function dynamic_loader(opts) {
  var _layer = '_' + opts.layer;
  var mixin = this[_layer];

  // already loaded
  if (mixin) {
    return mixin;
  }

  mixin = this.get(opts.layer);
  if (!mixin) {
    throw new Error(opts.layer + ' not specified');
  }

  var name = mixin + '';
  if ('function' != typeof mixin) {
    var preloaded = {};
    if (opts.preload) {
      preloaded = this.get(opts.preload) || {};
    }
    if (preloaded[name]) {
      mixin = preloaded[name];
    } else if (name.search(/^\w[\w\-\.]*$/) < 0) {
      throw new Error('invalid ' + opts.layer + ' name: ' + name);
    } else if (opts.basepath) {
      try {
        mixin = require(opts.basepath + '/' + name);
      } catch (err) {
        throw new Error(opts.layer + ' require failed: ' + err);
      }
    }
    if (!mixin) {
      throw new Error('invalid ' + opts.layer + ' class: ' + name);
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

  this[_layer] = mixin;
  return mixin;
}