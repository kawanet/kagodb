/*! index.js */

var collection = require('./lib/collection');
var cursor = require('./lib/cursor');
var webapi = require('./lib/webapi');

collection.prototype.find = cursor.find;
collection.prototype.count = cursor.count;
collection.prototype.webapi = webapi.webapi;

module.exports = collection;
