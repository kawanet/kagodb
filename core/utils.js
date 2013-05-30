/*! core/utils.js */

exports.extend = function(parent, child) {
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