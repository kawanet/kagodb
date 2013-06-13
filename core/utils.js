/*! utils.js */

/**
 * This module exports utility functions.
 *
 * @module utils
 */

/**
 * It imports super class's instance methods to the child class inherited.
 *
 * @param {Function} [child] - constructor for child class
 * @param {Function} [parent] - super class
 * @return {Function} child class
 * @see http://nodejs.org/api/util.html#util_util_inherits_constructor_superconstructor
 * @example
 * var utils = KagoDB.bundle.utils;
 *
 * function ParentClass() {}
 * ParentClass.prototype.foo = function() {
 *   console.log('bar');
 * };
 *
 * function ChildClass() {}
 * utils.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass();
 * child.foo(); // => 'bar'
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

/**
 * It applies an iterator function to each item in an array in series.
 * The next iterator is only called once the current one has completed processing.
 * This means the iterator functions will complete in order.
 *
 * @param {Array} arr - an array to iterate over
 * @param {Function} iterator - function(item, next) {}
 * @param {Function} [callback] - function(err) {}
 * @see https://github.com/caolan/async#eachseriesarr-iterator-callback
 * @example
 * var utils = KagoDB.bundle.utils;
 * var arr = ['foo', 'bar', 'baz'];
 *
 * utils.eachSeries(arr, iterator, end);
 *
 * function iterator(item, next) {
 *    console.log(item); // do some thing
 *    next();
 * }
 *
 * function end(err){
 *   console.error(err);
 * }
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

/**
 * It copies all of the properties in the source objects over to the destination object.
 *
 * @param {Object} dest - destination object
 * @param {Object} source - source object
 * @return {Object} destination object
 * @see http://underscorejs.org/#extend
 * @example
 * var utils = KagoDB.bundle.utils;
 *
 * var dest = {name : 'moe'};
 * var source = {age : 50};
 * utils.extend(dest, source);
 * console.log(dest); // => {name : 'moe', age : 50}
 */

exports.extend = function(dest, source) {
  source = source || {};
  for (var key in source) {
    dest[key] = source[key];
  }
  return dest;
};

/**
 * It creates a shallow-copied clone of the object.
 * Any nested objects or arrays will be copied by reference, not duplicated.
 *
 * @param {Object} source - source object
 * @return {Object} cloned object
 * @see http://underscorejs.org/#clone
 * @example
 * var utils = KagoDB.bundle.utils;
 *
 * var source = {name : 'moe'};
 * var clone = utils.extend(source);
 * console.log(clone); // => {name : 'moe'}
 */

exports.clone = function(source) {
  var object = {};
  for (var key in source) {
    object[key] = source[key];
  }
  return object;
};

/**
 * This makes an item as the model class's instance.
 *
 * @param {Object} item - target item
 * @param {Function} model - model class (constructor)
 * @return {Object} blessed item
 * @example
 * var utils = KagoDB.bundle.utils;
 *
 * function Item() {}
 * Item.prototype.NAME = function() {
 *   return this.name.toUpperCase();
 * };
 *
 * var item = {name : 'ken'};
 * item = utils.bless(item, Item);
 * console.log(item.name, item.NAME()); // => ken KEN
 */

exports.bless = function(item, model) {
  if (model && 'object' == typeof item) {
    if (item.__proto__) {
      // overwrite item's __proto__ when available (faster)
      item.__proto__ = model.prototype;
    } else {
      // copy properties in a new object per default (slower)
      var tmp = new model();
      for (var key in item) {
        if (item.hasOwnProperty(key)) tmp[key] = item[key];
      }
      item = tmp;
    }
    return item;
  }
};

/**
 * @ignore
 */

function NOP() {}