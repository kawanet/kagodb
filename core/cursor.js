/*! core/cursor.js */

var utils = require('./utils');

module.exports = Cursor;

function parseConditoin(condition) {
  // function type
  if ('function' == typeof condition) {
    return condition;
  }

  // default condition
  condition = condition || {};

  // other types than object
  if ('object' != typeof condition) {
    throw new Error('unknown condition: ' + condition);
  }

  var queries = Object.keys(condition);

  // no condition: every item OK
  if (!queries.length) {
    return null;
  }

  // one condition: faster
  if (queries.length == 1) {
    var key = queries[0];
    var val = condition[key];
    if ('object' != typeof val) {
      return function(item) {
        return (item[key] == val);
      };
    }
  }

  // more conditions:
  return function(item) {
    for (var key in condition) {
      if (item[key] != condition[key]) return false;
    }
    return true;
  };
}

/**
 * @class CursorMixin
 * @mixin
 */

Cursor.exporter = function() {
  this.find = find;
  this.count = count;
};

/** creates a cursor with condition applied
 * @method CursorMixin.prototype.find
 * @param condition - query parameters
 * @param {Function} callback - function(err, cursor) {}
 * @returns {Cursor} cursor
 * @example
 * collection.find().toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item);
 *   });
 * });
 */

function find(condition, callback) {
  callback = callback || NOP;
  var func = parseConditoin(condition);
  var cursor = new Cursor(this, func);
  callback(null, cursor);
  return cursor;
}

/** counts number of items matched with condition
 * @method CursorMixin.prototype.count
 * @param condition - query parameters
 * @param {Function} callback - function(err, cursor) {}
 * @returns collection instance itself for method chaining
 * @example
 * collection.find().count(function(err, count) {
 *   console.log(count);
 * });
 */

function count(condition, callback) {
  callback = callback || NOP;
  var cursor = this.find(condition);
  cursor.count(callback);
  return this;
}

/**
 * @class Cursor
 * @param collection
 * @param condition
 */

function Cursor(collection, condition) {
  this.collection = collection;
  this.condition = condition;
  this.filters = {};
}

/** invokes a callback function with a list of keys for all items
 * @param {Function} callback - function(err, list) {}
 * @returns {Cursor} instance itself for method chaining
 */

Cursor.prototype.keys = function(callback) {
  var self = this;
  callback = callback || NOP;
  if (self._keys) {
    callback(null, self._keys);
  } else {
    self.collection.keys(function(err, list) {
      callback(err, self._keys = list);
    });
  }
  return this;
};

/** invokes a callback function with a list of items found
 * @param {Function} callback - function(err, list) {}
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item);
 *   });
 * });
 */

Cursor.prototype.toArray = function(callback) {
  var self = this;
  callback = callback || NOP;

  if (self._values) {
    done(self._values); // cache
  } else {
    self.keys(function(err, list) {
      var buf = [];
      if (err) {
        callback(err);
        return;
      }
      each();

      function each(err, item) {
        if (err) {
          callback(err);
          return;
        }
        if (item) {
          if (!self.condition || self.condition(item)) {
            buf.push(item);
          }
        }
        if (list.length) {
          var id = list.shift();
          self.collection.read(id, each);
        } else {
          done(buf);
        }
      }
    });
  }

  function done(buf) {
    if (self.filters.sort) {
      buf = self.filters.sort(buf);
    }
    if (self.filters.offset) {
      buf = self.filters.offset(buf);
    }
    if (self.filters.limit) {
      buf = self.filters.limit(buf);
    }
    self._values = buf; // cache
    callback(null, buf);
  }

  return this;
};

/** invokes a callback function with the number of items found
 * @param {Function} callback - function(err, count) {}
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().count(function(err, count) {
 *   console.log(count);
 * });
 */

Cursor.prototype.count = function(callback) {
  callback = callback || NOP;
  this.keys(function(err, list) {
    if (err) {
      callback(err);
    } else {
      callback(null, list.length);
    }
  });
  return this;
};

/** specifies a sort parameters
 * @param {Object} param - sort parameters
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().sort({foo: 1, bar: -1}).toArray();
 */

Cursor.prototype.sort = function(param) {
  var keys = Object.keys(param);
  var keylen = keys.length;
  var func = function(a, b) {
    for (var i = 0; i < keylen; i++) {
      var key = keys[i];
      if (a[key] < b[key]) {
        return -param[key];
      } else if (a[key] > b[key]) {
        return param[key];
      }
    }
  };
  this.filters.sort = function(list) {
    return list.sort(func);
  };
  return this;
};

/** specifies a offset parameters
 * @param {Number} offset - offset parameter
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().offset(100).toArray();
 */

Cursor.prototype.offset = function(offset) {
  this.filters.offset = function(list) {
    return list.splice(offset);
  };
  return this;
};

/** specifies a limit parameters
 * @param {Number} limit - limit parameter
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().limit(100).toArray();
 */

Cursor.prototype.limit = function(limit) {
  this.filters.limit = function(list) {
    return list.splice(0, limit);
  };
  return this;
};

function NOP() {}