/*! http_superagent.js */

var http_base = require('../core/http_base');
var request_superagent = require('../mixin/request_superagent');
var utils = require('../core/utils');

module.exports = function() {
  var http_mixin = http_base.call(this);
  var request_mixin = request_superagent.call(this);
  var mixin = {};
  utils.extend(mixin, http_mixin);
  utils.extend(mixin, request_mixin);
  return mixin;
};
