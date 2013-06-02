/*! yaml.js */

var jsyaml = require('js-yaml');
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
  return this.get('suffix') || '.yaml';
}

function file_decode(source, callback) {
  var item;
  try {
    item = jsyaml.load(source);
  } catch (err) {
    callback(err);
    return;
  }
  callback(null, item);
}

function file_encode(item, callback) {
  var encoded;
  try {
    encoded = jsyaml.dump(item);
  } catch (err) {
    callback(err);
  }
  callback(null, encoded);
}