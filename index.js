/*! index.js */

var Base = require('./core/base');
var Storage = require('./core/storage');
var Cursor = require('./core/cursor');
var condition = require('./core/condition');
var Webapi = require('./core/webapi');

var KagoDB = Base.inherit();
KagoDB.use(Storage);
KagoDB.use(Cursor);
KagoDB.use(condition);
KagoDB.use(Webapi);

module.exports = KagoDB;
