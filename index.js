/*! index.js */

var Base = require('./core/base');
var Storage = require('./core/storage');
var Cursor = require('./core/cursor');
var Webapi = require('./core/webapi');

var KagoDB = Base.inherit();
KagoDB.use(Storage);
KagoDB.use(Cursor);
KagoDB.use(Webapi);

module.exports = KagoDB;
