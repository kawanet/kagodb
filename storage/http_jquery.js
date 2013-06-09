/*! http_jquery.js */

var http_base = require('../core/http_base');
var request_jquery = require('../mixin/request_jquery');
var utils = require('../core/utils');

module.exports = function() {
  var http_mixin = http_base.call(this);
  var request_mixin = request_jquery.call(this);
  var mixin = {};
  utils.extend(mixin, http_mixin);
  utils.extend(mixin, request_mixin);
  return mixin;
};
