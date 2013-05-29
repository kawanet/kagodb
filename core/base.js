/*! core/base.js */

function inherit(parent) {
  /** Base class for the inheritance
   * @class KagoDB
   * @param {Object} options - option parameters
   */

  function Base(options) {
    var key;
    if (!(this instanceof Base)) return new Base(options);
    parent.call(this);
    for (key in Base.options) {
      this.set(key, Base.options[key]);
    }
    for (key in options) {
      this.set(key, options[key]);
    }
  }

  Base.prototype = wrap(parent.prototype);
  Base.options = copy(parent.options);

  /** load a mixin class which will export instance methods
   * @method KagoDB.use
   * @param {Function} mixin - mixin class which has exporter() class method
   * @returns this class itself for method chaining
   */
  Base.use = function(mixin) {
    mixin.exporter.call(Base.prototype);
    return Base;
  };

  /** builds an instance as same as new Base()
   * @method KagoDB.build
   * @param {Object} options - option parameters
   * @returns {KagoDB} an instance
   */
  Base.build = function(options) {
    return new Base(options);
  };

  /** generates a sub class which inherits this class
   * @method KagoDB.inherit
   * @static
   * @returns a sub class
   */
  Base.inherit = function() {
    return inherit(Base);
  };

  /** gets a default parameter value for the class
   * @method KagoDB.get
   * @param {String} key - parameter name
   * @returns parameter value
   */
  Base.get = function(key) {
    return Base.options[key];
  };

  /** sets a default parameter value for the class
   * @method KagoDB.set
   * @param {String} key - parameter name
   * @param val - new value
   * @returns this class itself for method chaining
   */
  Base.set = function(key, val) {
    Base.options[key] = val;
    return Base;
  };

  return Base;
}

function copy(parent) {
  var object = {};
  for (var key in parent) {
    object[key] = parent[key];
  }
  return object;
}

function wrap(parent) {
  var anonymous = function() {};
  anonymous.prototype = parent;
  return new anonymous();
}

function Root() {
  if (!(this instanceof Root)) return new Root(options);
  this.options = {};
}

Root.options = {};

/** gets a parameter value for the instance parameters
 * @method KagoDB.prototype.get
 * @param {String} key - parameter name
 * @returns parameter value
 */
Root.prototype.get = function(key) {
  return this.options[key];
};

/** sets a parameter value for the instance parameters
 * @method KagoDB.prototype.set
 * @param {String} key - parameter name
 * @param val - new parameter value
 * @returns this instance itself for method chaining
 */
Root.prototype.set = function(key, val) {
  this.options[key] = val;
  return this;
};

module.exports = inherit(Root);