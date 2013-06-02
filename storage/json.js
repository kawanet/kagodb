/*! json.js */

var file_base = require('../core/file_base');

module.exports = function() {
  var mixin = file_base.call(this);
  mixin.file_suffix = file_suffix;
  return mixin;
};

function file_suffix() {
  return this.get('suffix') || '.json';
}
