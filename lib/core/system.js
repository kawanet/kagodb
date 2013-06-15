/*! system.js */

/**
 * The module exports version() function.
 *
 * @module system
 */

/**
 * This returns a version string of KagoDB library.
 *
 * @returns {String} version string. e.g. "kagodb 0.2.1"
 * @example
 * var version = KagoDB.bundle.system.version();
 */

exports.version = function() {
  var pkg = require('../../package.json');
  var name = pkg.name;
  var ver = pkg.version;
  return name + ' ' + ver;
};