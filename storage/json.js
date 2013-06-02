/*! json.js */

var utils = require('../core/utils');
var file_base = require('./file-base');

module.exports = function() {
  var mixin = file_base.apply(this, arguments);
  mixin.file_suffix = file_suffix;
  mixin.file_decode = file_decode;
  mixin.file_encode = file_encode;
  return mixin;
};

function file_suffix() {
  return this.get('suffix') || '.json';
}

function file_decode(source, callback) {
  var item;
  try {
    item = JSON.parse(source);
  } catch (err) {
    callback(err);
    return;
  }
  callback(null, item);
}

function file_encode(item, callback) {
  var encoded;
  var replacer = this.options['json-replacer'];
  var spaces = this.options['json-spaces'];
  try {
    encoded = JSON.stringify(item, replacer, spaces);
  } catch (err) {
    callback(err);
  }
  callback(null, encoded);
}

function NOP() {}