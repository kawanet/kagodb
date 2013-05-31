/*! base.js */

var utils = require('./utils');

function inherit(parent) {

  /** KagoDB class.
   * @class KagoDB
   * @param {Object} options - option parameters
   * @returns {KagoDB} an instance
   * @example
   * var kago = new KagoDB(options);
   * var kago2 = KagoDB(options); // same as above
   */

  // note that the below doesn't call super classes' constructors.

  function child(options) {
    if (!(this instanceof child)) return new child(options);
    this.set(child.options);
    this.set(options);
  }

  utils.inherits(child, parent);

  child.options = copy(parent.options);

  /** This loads a mixin class which will export instance methods.
   * @method KagoDB.mixin
   * @param {Function} mixin - mixin class which has exporter() class method
   * @returns this class itself for method chaining
   * @example
   * var MyMixin = require('mymixin');
   * var KagoDB = require('kagodb');
   * var MyKago = KagoDB.inherit();
   * MyKago.use(MyMixin);
   * var kago = new MyKago();
   */
  child.mixin = function(mixin) {
    mixin.call(child.prototype);
    return child;
  };

  /** This builds an instance as same as new child(). It would be good for method chaining.
   * @method KagoDB.build
   * @param {Object} options - option parameters
   * @returns {KagoDB} an instance
   * @example
   * var kago = KagoDB.build(options);
   */
  child.build = function(options) {
    return new child(options);
  };

  /** This generates a sub class which inherits KagoDB class or its descendant.
   * @method KagoDB.inherit
   * @returns a sub class
   * @example
   * var MyKago = KagoDB.inherit();
   * var kago = new MyKago();
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
 * var kago = new KagoDB({path: 'data'});
 * var path = kago.get('path');
 */
KagoDB.prototype.get = function(key) {
  var opts = this.options || (this.options = {});
  return opts[key];
};

/** This sets a parameter value for the instance parameters.
 * @method KagoDB.prototype.set
 * @param {String|Object} keys - parameter name or a parameters object
 * @param {any} [val] - new parameter value
 * @returns this instance itself for method chaining
 * @example
 * var kago = new KagoDB();
 * kago.set('path', 'data');
 * kago.set({'storage': 'yaml'});
 */
KagoDB.prototype.set = function(key, val) {
  var opts = this.options || (this.options = {});
  var len = arguments.length;
  if (len == 2 && key) {
    opts[key] = val;
  } else if (len == 1 && key) {
    var args = key;
    for (key in args) {
      opts[key] = args[key];
    }
  }
  return this;
};

module.exports = inherit(KagoDB);