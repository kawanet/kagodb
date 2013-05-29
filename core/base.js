/*! core/base.js */

function inherit(parent) {
  /** constructor
   * @class Base
   * @param {Object} options - option parameters
   */

  function Base(options) {
    if (!(this instanceof Base)) return new Base(options);
    parent.call(this);
    for (var key in Base.options) {
      this.set(key, Base.options[key])
    }
    for (var key in options) {
      this.set(key, options[key])
    }
  }

  Base.prototype = wrap(parent.prototype);
  Base.options = copy(parent.options);

  /** load a mixin
   * @static
   * @param {Function} mixin - mixin function
   * @returns this class itself for method chaining
   */
  Base.use = function(mixin) {
    mixin.call(Base.prototype);
    return Base;
  };

  /** build an instance as same as new Base()
   * @static
   * @param {Object} options - option parameters
   * @returns {Base} an instance
   */
  Base.build = function(options) {
    return new Base(options);
  };

  /** generate a sub class which inherits this class
   * @static
   * @returns a sub class
   */
  Base.inherit = function() {
    return inherit(Base);
  };

  /** get this class's default parameter value
   * @static
   * @param {String} - key parameter name
   * @returns parameter value
   */
  Base.get = function(key) {
    return Base.options[key];
  };

  /** set this class's default parameter value
   * @static
   * @param {String} - key parameter name
   * @param val new value
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

/** root class of the World
 * @class
 */

function Root() {
  if (!(this instanceof Root)) return new Root(options);
  this.options = {};
}

Root.options = {};

/** get a parameter value
 * @param {String} key - parameter name
 * @returns parameter value
 */
Root.prototype.get = function(key) {
  return this.options[key];
};

/** set a parameter value
 * @param {String} key - parameter name
 * @param val - new parameter value
 * @returns this instance itself for method chaining
 */
Root.prototype.set = function(key, val) {
  this.options[key] = val;
  return this;
};

module.exports = inherit(Root);