/*! core/utils.js */

/** Utilities
 * @class Utils
 */

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

function NOP() {}