/*! default.js */

var Base = require('../core/base');
var storage = require('../mixin/storage');
var find = require('../mixin/find');
var webapi = require('../mixin/webapi');
var version = require('../mixin/version');
var pkey = require('../mixin/pkey');

var KagoDB = Base.inherit();

KagoDB.mixin(version());
KagoDB.mixin(find());
KagoDB.mixin(storage());
KagoDB.mixin(pkey());
KagoDB.mixin(webapi());

module.exports = KagoDB;
