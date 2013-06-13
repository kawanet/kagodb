/*! system.js */

/** The System class provides system information.
 * @class System
 */

/** This returns a version string of KagoDB library.
 * @method System.version
 * @returns {String} version string. e.g. "kagodb 0.2.1"
 * @example
 */

exports.version = function() {
  var pkg = require('../package.json');
  var name = pkg.name;
  var ver = pkg.version;
  return name + ' ' + ver;
};