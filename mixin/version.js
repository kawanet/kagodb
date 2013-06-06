/*! version.js */

/** This mixin provides version() methods.
 * @class VersionMixin
 * @mixin
 */

module.exports = function() {
  var mixin = {};
  mixin.version = version;
  return mixin;
};

/** This returns a version string of KagoDB library.
 * @method VersionMixin.prototype.version
 * @returns {String} version string. e.g. "kagodb 0.2.1"
 * @example
 */

function version() {
  var pkg = require('../package.json');
  var name = pkg.name;
  var ver = pkg.version;
  return name + ' ' + ver;
}
