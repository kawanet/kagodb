/*! system.js */

/**
 * The module exports version() function.
 *
 * @module system
 */

var system = require('./system.json');

/**
 * This returns a version string of KagoDB library.
 *
 * @returns {String} version string. e.g. "0.2.23"
 * @example
 * var version = KagoDB.bundle.system.version();
 */

exports.version = function() {
  return system.version;
};
