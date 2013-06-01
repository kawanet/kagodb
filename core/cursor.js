/*! cursor.js */

var utils = require('./utils');

module.exports = Cursor;

/** Please create a Cursor instance via find() method instead of calling the constructor directly.
 * @class Cursor
 * @param {KagoDB} collection - source collection
 * @param {Function} [condition] - test function
 * @param {Function} [projection] - map function
 */

function Cursor(collection, condition, projection) {
  this.collection = collection;
  this.condition = condition;
  this.projection = projection;
  this.filters = {};
}

/** This invokes a callback function with an index for all items.
 * @param {Function} callback - function(err, list) {}
 * @returns {Cursor} instance itself for method chaining
 */

Cursor.prototype.index = function(callback) {
  var self = this;
  callback = callback || NOP;
  if (self._index) {
    callback(null, self._index);
  } else {
    self.collection.index(function(err, list) {
      callback(err, self._index = list);
    });
  }
  return this;
};

/** This invokes a callback function with a list of items found.
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

  var condition = this.condition;
  if (condition && 'function' != typeof condition) {
    var err = new Error('invalid condition: ' + condition);
    callback(err);
    return;
  }

  var sort = self.filters.sort;
  var offset = self.filters.offset || 0;
  var limit = self.filters.limit || 0;
  var last = (offset >= 0 && limit >= 1) ? offset + limit : 0;

  if (self._values) {
    done(self._values); // cache
  } else {
    self.index(function(err, list) {
      var buf = [];
      if (err) {
        callback(err);
        return;
      }
      each();

      function each(err, item) {
        // error on read
        if (err) {
          callback(err);
          return;
        }

        // test last item
        if (item) {
          if (!condition || condition(item)) {
            buf.push(item);
          }
        }

        // findOne() or find().limit()
        if (last && buf.length >= last) {
          done(buf);
          return;
        }

        // no more items
        if (!list.length) {
          done(buf);
          return;
        }

        // read next item
        var id = list.shift();
        self.collection.read(id, each);
      }
    });
  }

  function done(buf) {
    if (sort) {
      buf = buf.sort(sort);
    }
    if (offset) {
      buf = buf.splice(offset);
    }
    if (limit) {
      buf = buf.splice(0, limit);
    }
    if (self.projection) {
      buf = buf.map(self.projection);
    }
    self._values = buf; // cache
    callback(null, buf);
  }

  return this;
};

/** This invokes a callback function with the number of items found
 * @param {Function} callback - function(err, count) {}
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().count(function(err, count) {
 *   console.log(count);
 * });
 */

Cursor.prototype.count = function(callback) {
  callback = callback || NOP;
  this.index(function(err, list) {
    if (err) {
      callback(err);
    } else {
      callback(null, list.length);
    }
  });
  return this;
};

/** This specifies a sort parameters
 * @param {Function|Object} order - sort function or parameters
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().sort(function(a,b){return a.price - b.price;}).toArray();
 * collection.find().sort({price: 1, stock: -1}).toArray();
 */

Cursor.prototype.sort = function(order) {
  if ('object' == typeof order) {
    var index = Object.keys(order);
    var keylen = index.length;
    var func = function(a, b) {
      for (var i = 0; i < keylen; i++) {
        var key = index[i];
        if (a[key] < b[key]) {
          return -order[key];
        } else if (a[key] > b[key]) {
          return order[key];
        }
      }
    };
    this.filters.sort = func;
  } else {
    this.filters.sort = order;
  }
  return this;
};

/** This specifies a offset parameters
 * @param {Number} offset - offset parameter
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().offset(100).toArray();
 */

Cursor.prototype.offset = function(offset) {
  this.filters.offset = offset;
  return this;
};

/** This specifies a limit parameters
 * @param {Number} limit - limit parameter
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().limit(100).toArray();
 */

Cursor.prototype.limit = function(limit) {
  this.filters.limit = limit;
  return this;
};

function NOP() {}
