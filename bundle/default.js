/*! default.js */

var Common = require('./common');
var webapi = require('../mixin/webapi');

var KagoDB = Common.inherit();
KagoDB.mixin(webapi());
module.exports = KagoDB;
