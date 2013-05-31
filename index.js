/*! index.js */

var Base = require('./core/base');
var storage = require('./mixin/storage');
var cursor = require('./mixin/find');
var condition = require('./mixin/condition');
var webapi = require('./mixin/webapi');

var KagoDB = Base.inherit();
KagoDB.use(storage);
KagoDB.use(cursor);
KagoDB.use(condition);
KagoDB.use(webapi);

module.exports = KagoDB;
