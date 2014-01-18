/*! encode.js */

module.exports = function() {
  var mixin = {};
  mixin.decode = decode;
  mixin.encode = encode;
  mixin.escape = encodeURIComponent;
  mixin.unescape = decodeURIComponent;
  return mixin;
};

/**
 * This unserializes a string as an item object.
 * Override this method when you need another serialized representation other than JSON.
 *
 * @method KagoDB.prototype.decode
 * @param {String} source - source string
 * @param {Function} callback - function(err, item) {}
 * @returns {Cursor} instance itself for method chaining
 * @example
 *
 * var xml2js = require('xml2js');
 * var MyKago = KagoDB.inherit();
 * MyKago.prototype.decode = function(source, callback) {
 *     xml2js.parseString(source, callback);
 * };
 * var collection = new MyKago();
 */

function decode(source, callback) {
  var item;
  try {
    item = JSON.parse(source);
  } catch (err) {
    callback(err);
    return;
  }
  if (this.unwrap) {
    item = this.unwrap(item);
  }
  callback(null, item);
}

/**
 * This serialize an item object as a serialized string.
 * Override this method when you need another serialized representation other than JSON.
 *
 * @method KagoDB.prototype.encode
 * @param {Object} item - source item
 * @param {Function} callback - function(err, str) {}
 * @returns {Cursor} instance itself for method chaining
 * @example
 *
 * var js2xml = require('js2xml');
 * var MyKago = KagoDB.inherit();
 * MyKago.prototype.decode = function(source, callback) {
 *   var js2xml = new Js2Xml('item', person);
 *   var str = js2xml.toString();
 *   callback(null, str);
 * };
 * var collection = new MyKago();
 */

function encode(item, callback) {
  var encoded;
  var replacer = this.get('json_replacer');
  var spaces = this.get('json_spaces');
  if (this.wrap) {
    item = this.wrap(item);
  }
  try {
    encoded = JSON.stringify(item, replacer, spaces);
  } catch (err) {
    callback(err);
  }
  callback(null, encoded);
}

/**
 * This escapes a special characters in the item ID string.
 * It uses encodeURIComponent function per default.
 * Override this method when you need another escape representation other than URI (percent) encoding.
 *
 * @method KagoDB.prototype.escape
 * @param {String} source - unescaped string
 * @returns {String} escaped string
 * @example
 *
 * var MyKago = KagoDB.inherit();
 * MyKago.prototype.escape = function(source) {
 *     return source.replace(/\W/g, '_');
 * };
 * var collection = new MyKago();
 */

/**
 * This unescapes a special characters in the item ID string
 * It uses decodeURIComponent function per default.
 * Override this method when you need another escape representation other than URI (percent) encoding.
 *
 * @method KagoDB.prototype.unescape
 * @param {String} source - escaped string
 * @returns {String} unescaped string
 * @example
 *
 * var MyKago = KagoDB.inherit();
 * MyKago.prototype.unescape = function(source) {
 *     return source.replace(/^prefix-/, ''); // remove a prefix
 * };
 * var collection = new MyKago();
 */
