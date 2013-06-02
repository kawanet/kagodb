/*! base.js */

var utils = require('./utils');

function inherit(parent) {

  /** KagoDB class constructor.
   * @class KagoDB
   * @param {Object} options - option parameters for the instance
   * @returns {KagoDB} an instance
   * @example
   * var collection = new KagoDB(options);
   * var collection2 = KagoDB(options); // same as above
   */

  // note that the below doesn't call super classes' constructors.

  function child(options) {
    if (!(this instanceof child)) return new child(options);
    this.set(child.options);
    this.set(options);
  }

  utils.inherits(child, parent);

  child.options = copy(parent.options);

  /** This applies a mixin object which exports instance methods.
   * @method KagoDB.mixin
   * @param {Object|Function} mixin - mixin object or mixin function which returns mixin object
   * @returns this class itself for method chaining
   * @example
   * var MyMixin = require('mymixin');
   * var KagoDB = require('kagodb');
   * var MyKago = KagoDB.inherit();
   * MyKago.use(MyMixin);
   * var collection = new MyKago();
   */
  child.mixin = function(mixin) {
    _mixin(child.prototype, mixin);
    return child;
  };

  /** This builds an instance as same as new KagoDB(). It would be good for method chaining.
   * @method KagoDB.build
   * @param {Object} options - option parameters
   * @returns {KagoDB} an instance
   * @example
   * var collection = KagoDB.build(options);
   */
  child.build = function(options) {
    return new child(options);
  };

  /** This generates a sub class which inherits KagoDB class or its descendant.
   * @method KagoDB.inherit
   * @returns a sub class
   * @example
   * var MyKago = KagoDB.inherit();
   * var collection = new MyKago();
   */
  child.inherit = function() {
    return inherit(child);
  };

  /** This gets a default parameter value for the class.
   * @method KagoDB.get
   * @param {String} key - parameter name
   * @returns parameter value
   * @example
   * var path = KagoDB.get('path');
   */
  child.get = function(key) {
    var opts = child.options || (child.options = {});
    return opts[key];
  };

  /** This sets a default parameter value for the class.
   * @method KagoDB.set
   * @param {String|Object} key - parameter name or a parameters object
   * @param {any} [val] - new value
   * @returns this class itself for method chaining
   * @example
   * KagoDB.set('path', 'data');
   * KagoDB.set({'storage': 'yaml'});
   */
  child.set = function(key, val) {
    var opts = child.options || (child.options = {});
    opts[key] = val;
    return child;
  };

  return child;
}

function copy(parent) {
  var object = {};
  for (var key in parent) {
    object[key] = parent[key];
  }
  return object;
}

function KagoDB() {}

/** This gets a parameter value for the instance parameters.
 * @method KagoDB.prototype.get
 * @param {String} key - parameter name
 * @returns parameter value
 * @example
 * var collection = new KagoDB({path: 'data'});
 * var path = collection.get('path');
 */
KagoDB.prototype.get = function(key) {
  var opts = this.options || (this.options = {});
  return opts[key];
};

/** This sets a parameter value for the instance parameters.
 * @method KagoDB.prototype.set
 * @param {String|Object} key - parameter name or a parameters object
 * @param {any} [val] - new parameter value
 * @returns {KagoDB} this instance itself for method chaining
 * @example
 * var collection = new KagoDB();
 * collection.set('path', 'data');
 * collection.set({'storage': 'yaml'});
 */
KagoDB.prototype.set = function(key, val) {
  var opts = this.options || (this.options = {});
  var len = arguments.length;
  if (len == 2 && key) {
    opts[key] = val;
  } else if (len == 1 && 'object' == typeof key) {
    var args = key;
    for (key in args) {
      opts[key] = args[key];
    }
  } else if (len > 1 || 'undefined' != typeof key) {
    throw new Error('invalid set(' + key + ', ' + val + ')');
  }
  return this;
};

KagoDB.prototype.mixin = function(mixin) {
  _mixin(this, mixin);
  return this;
};

function _mixin(target, mixin) {
  if ('function' == typeof mixin) {
    mixin = mixin.call(target);
  }
  if ('object' == typeof mixin) {
    for (var key in mixin) {
      target[key] = mixin[key];
    }
  } else if (!mixin) {
    throw new Error('invalid mixin(' + mixin + ')');
  }
}

module.exports = inherit(KagoDB);