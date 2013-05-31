/*! index.js */

var Base = require('./core/base');
var storage = require('./mixin/storage');
var cursor = require('./mixin/find');
var condition = require('./mixin/condition');
var webapi = require('./mixin/webapi');

var KagoDB = Base.inherit();

KagoDB.mixin(storage);
KagoDB.mixin(cursor);
KagoDB.mixin(condition);
KagoDB.mixin(webapi);

module.exports = KagoDB;
