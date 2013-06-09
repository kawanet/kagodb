/*! utils.js */

/** Utilities
 * @class Utils
 */

exports = module.exports = function() {
  return {
    utils: exports
  };
};

/**
 * It imports super class's instance methods to the child class inherited.
 * @method Utils.inherits
 * @param {Function} [child] - constructor for child class
 * @param {Function} [parent] - super class
 * @returns {Function} child class
 * @see http://nodejs.org/api/util.html#util_util_inherits_constructor_superconstructor
 */

exports.inherits = function(child, parent) {
  parent = parent || function() {};
  child = child || function() {
    parent.apply(this, arguments);
  };

  var wrap = function() {};
  wrap.prototype = parent.prototype;
  child.prototype = new wrap();
  child.prototype.__super__ = parent;

  return child;
};

/** It applies an iterator function to each item in an array in series.
 * The next iterator is only called once the current one has completed processing.
 * This means the iterator functions will complete in order.
 * @method Utils.eachSeries
 * @param {Array} arr - an array to iterate over
 * @param {Function} iterator - function(item, next) {}
 * @param {Function} [callback] - function(err) {}
 * @see https://github.com/caolan/async#eachseriesarr-iterator-callback
 */

exports.eachSeries = function(arr, iterator, callback) {
  iterator = iterator || NOP;
  callback = callback || NOP;
  var src = [].concat(arr);

  function each(err) {
    if (err) {
      callback(err);
    } else if (src.length) {
      var item = src.shift();
      iterator(item, each);
    } else {
      callback();
    }
  }
  each();
};

/** It copies all of the properties in the source objects over to the destination object.
 * @method Utils.extend
 * @param {Object} dest - destination object
 * @param {Object} source - source object
 * @return {Object} destination object
 * @see http://underscorejs.org/#extend
 */

exports.extend = function(dest, source) {
  source = source || {};
  for (var key in source) {
    dest[key] = source[key];
  }
  return dest;
};

/** It creates a shallow-copied clone of the object.
 * Any nested objects or arrays will be copied by reference, not duplicated.
 * @param {Object} source - source object
 * @return {Object} cloned object
 * @see http://underscorejs.org/#clone
 */

exports.clone = function(source) {
  var object = {};
  for (var key in source) {
    object[key] = source[key];
  }
  return object;
};

/**
 * @ignore
 */

function NOP() {}