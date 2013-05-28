/*! index.js */

var Base = require('./lib/base');
var Collection = require('./lib/collection');
var Cursor = require('./lib/cursor');
var Webapi = require('./lib/webapi');

var index = Base.inherit();
index.use(Collection);
index.use(Cursor);
index.use(Webapi);

module.exports = index;
