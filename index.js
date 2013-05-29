/*! index.js */

var Base = require('./core/base');
var Storage = require('./core/storage');
var Cursor = require('./core/cursor');
var Webapi = require('./core/webapi');
var Memory = require('./storage/memory');

var index = Base.inherit();
index.use(Storage);
index.use(Cursor);
index.use(Webapi);
// index.use(Memory);

module.exports = index;
