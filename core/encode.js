/*! encode.js */

module.exports = function() {
  var mixin = {};
  mixin.decode = decode;
  mixin.encode = encode;
  mixin.escape = encodeURIComponent;
  mixin.unescape = decodeURIComponent;
  return mixin;
};

function decode(source, callback) {
  var item;
  try {
    item = JSON.parse(source);
  } catch (err) {
    callback(err);
    return;
  }
  callback(null, item);
}

function encode(item, callback) {
  var encoded;
  var replacer = this.get('json_replacer');
  var spaces = this.get('json_spaces');
  try {
    encoded = JSON.stringify(item, replacer, spaces);
  } catch (err) {
    callback(err);
  }
  callback(null, encoded);
}