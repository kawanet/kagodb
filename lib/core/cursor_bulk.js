/*! cursor_bulk.js */

var utils = require('../core/utils');

module.exports = CursorBulk;

function CursorBulk(collection, condition, projection, options) {
  this.settings = options || {};
  this.collection = collection;
  this._condition = condition;
  this._projection = projection;
}

CursorBulk.prototype.toArray = function(callback) {
  callback = callback || NOP;
  if (this.cache) {
    var list = [].concat(this.cache);
    callback(list);
  } else {
    var cursor = this._cursor();
    cursor.toArray(function(err, list) {
      if (!err && list) {
        this.cache = list;
        list = [].concat(this.cache);
      }
      callback(err, list);
    });
  }
};

CursorBulk.prototype._cursor = function() {
  var collection = this.collection;
  var condition = this._condition;
  var projection = this._projection;
  var options = this.settings;
  // collection.find() method would be overidden not to use CursorBulk
  var cursor = collection.find(condition, projection, options);
  return cursor;
};

CursorBulk.prototype.count = function(callback) {
  var cursor = this._cursor();
  // some cursor implementation may have count() method
  if (cursor.count) {
    cursor.count(callback);
    return;
  }
  // call toArray() method, otherwise
  cursor.toArray(function(err, list) {
    if (err) {
      callback(err);
    } else {
      list = list || [];
      callback(null, list.length);
    }
  });
};

CursorBulk.prototype.sort = function(sort) {
  this.settings.sort = sort;
  return this;
};

CursorBulk.prototype.offset = function(offset) {
  this.settings.skip = offset;
  return this;
};

CursorBulk.prototype.limit = function(limit) {
  this.settings.limit = limit;
  return this;
};

CursorBulk.prototype.each = function(callback) {
  var self = this;
  callback = callback || NOP;

  this.nextObject(iterator);

  function iterator(err, item) {
    callback(err, item);
    if (!err && item) self.nextObject(iterator);
  }
};

CursorBulk.prototype.nextObject = function(callback) {
  var self = this;
  callback = callback || NOP;

  if (this.list) {
    if (!this.list.length) return callback(); // EOF
    var item = this.list.shift();
    callback(null, item);
  } else {
    this.toArray(function(err, list) {
      if (err) return callback(err);
      self.list = list || [];
      self.nextObject(callback);
    });
  }
  return this;
};

CursorBulk.prototype.rewind = function(callback) {
  delete this.list;
};

function NOP() {}
