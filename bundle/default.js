/*! default.js */

var Base = require('../core/base');
var storage = require('../mixin/storage');
var find = require('../mixin/find');
var webapi = require('../mixin/webapi');
var version = require('../mixin/version');

var KagoDB = Base.inherit();
KagoDB.mixin(version());
KagoDB.mixin(find());
KagoDB.mixin(webapi());
KagoDB.mixin(storage());

module.exports = KagoDB;
