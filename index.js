/*! index.js */

var Express = require('./lib/dbyaml.express');
var Collection = require('./lib/dbyaml.collection');
var Cursor = require('./lib/dbyaml.cursor');

Collection.prototype.find = Cursor.find;
Collection.prototype.count = Cursor.count;

exports.collection = Collection;
exports.express = Express;