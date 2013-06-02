/*! index.js */

var Base = require('./core/base');
var storage = require('./mixin/storage');
var find = require('./mixin/find');
var webapi = require('./mixin/webapi');

var KagoDB = Base.inherit();

KagoDB.mixin(storage());
KagoDB.mixin(find());
KagoDB.mixin(webapi());

module.exports = KagoDB;
