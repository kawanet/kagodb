/*! cursor.js */

var utils = require('./utils');
var ConditionParser = require('../core/condition');
var ProjectionParser = require('../core/projection');

module.exports = Cursor;

function Proto() {}

Proto.prototype.nextObject = function(callback) {
  if (!this.source) throw new Error('no source');
  this.source.nextObject(callback);
};

Proto.prototype.rewind = function() {
  if (!this.source) throw new Error('no source');
  if (this.source.rewind) this.source.rewind();
  delete this.nextObject;
  return this;
};

/** Please create a Cursor instance via find() method instead of calling the constructor directly.
 * @class Cursor
 * @param {KagoDB} collection - source collection
 * @param {Function} [condition] - test function
 * @param {Function} [projection] - map function
 */

function Cursor(collection, condition, projection) {
  this.collection = collection;
  this.source = new Source(this.collection);
  this._source = this.source;
  if (condition) {
    condition = ConditionParser.parser(condition);
    if (condition) {
      this.source = new Condition(this.source, condition);
    }
  }
  if (projection) {
    projection = ProjectionParser.parser(projection);
    if (projection) {
      this.source = new Projection(this.source, projection);
    }
  }
}

utils.inherits(Cursor, Proto);

/** This invokes a callback function with an index for all items of the collection whether a condition is given or not.
 * @param {Function} callback - function(err, list) {}
 * @returns {Cursor} instance itself for method chaining
 */

Cursor.prototype.index = function(callback) {
  var self = this;
  callback = callback || NOP;
  if (self._index) {
    var list = [].concat(self._index); // clone
    callback(null, list);
  } else {
    self.collection.index(function(err, list) {
      if (err) {
        callback(err);
      } else {
        self._index = list;
        list = [].concat(self._index); // clone
        callback(null, list);
      }
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

  if (self._toArray) {
    var list = [].concat(self._toArray); // clone
    callback(null, list);
  } else {
    toArray(this.source, function(err, list) {
      if (err) {
        callback(err);
      } else {
        self._toArray = list;
        list = [].concat(self._toArray); // clone
        callback(null, list);
      }
    });
  }
  return this;
};

Cursor.prototype.each = function(callback) {
  var self = this;
  callback = callback || NOP;

  this.nextObject(iterator);

  function iterator(err, item) {
    callback(err, item);
    if (!err && item) self.nextObject(iterator);
  }
}

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
  var getlist = (this.source === this._source) ? this.index : this.toArray;
  getlist.call(this, function(err, list) {
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
  this.source = new Sort(this.source, order);
  return this;
};

/** This specifies a offset parameters
 * @param {Number} offset - offset parameter
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().offset(100).toArray();
 */

Cursor.prototype.offset = function(offset) {
  this.source = new Offset(this.source, offset);
  return this;
};

/** This specifies a limit parameters
 * @param {Number} limit - limit parameter
 * @returns {Cursor} instance itself for method chaining
 * @example
 * collection.find().limit(100).toArray();
 */

Cursor.prototype.limit = function(limit) {
  this.source = new Limit(this.source, limit);
  return this;
};

function Source(collection) {
  this.collection = collection;
}

utils.inherits(Source, Proto);

Source.prototype.nextObject = function(callback) {
  var self = this;
  callback = callback || NOP;

  // read all keys at first
  this.collection.index(function(err, list) {
    if (err) return callback(err);
    self.list = list || [];
    self.nextObject = self._nextObject;
    self.nextObject(callback);
  });
};

Source.prototype._nextObject = function(callback) {
  if (!this.list.length) return callback(); // EOF
  var id = this.list.shift();
  this.collection.read(id, callback);
};

Source.prototype.rewind = function(callback) {
  delete this.nextObject;
};

function Condition(source, condition) {
  this.source = source;
  this.condition = condition;
}

utils.inherits(Condition, Proto);

Condition.prototype.nextObject = function(callback) {
  var self = this;
  var source = this.source;
  var condition = this.condition;
  if ('function' != typeof condition) {
    var err = new Error('invalid condition: ' + condition);
    callback(err);
    return;
  }

  source.nextObject(next);

  function next(err, item) {
    if (err) {
      callback(err);
    } else if (!item) {
      self.nextObject = through;
      callback(); // EOF
    } else if (condition(item)) {
      callback(null, item); // OK
    } else {
      source.nextObject(next); // NG
    }
  }
};

function Sort(source, order) {
  var sorter;
  if ('object' == typeof order) {
    var index = Object.keys(order);
    var keylen = index.length;
    this.sorter = function(a, b) {
      for (var i = 0; i < keylen; i++) {
        var key = index[i];
        if (a[key] < b[key]) {
          return -order[key];
        } else if (a[key] > b[key]) {
          return order[key];
        }
      }
    };
  } else {
    this.sorter = order;
  }
  this.source = source;
}

utils.inherits(Sort, Proto);

Sort.prototype.nextObject = function(callback) {
  var self = this;
  callback = callback || NOP;

  toArray(this.source, function(err, list) {
    if (err) return callback(err);
    list = list || [];
    self.list = list.sort(self.sorter);
    self.nextObject = self._nextObject; // replace
    self.nextObject(callback);
  });
};

Sort.prototype._nextObject = function(callback) {
  callback = callback || NOP;
  var item = this.list.shift();
  callback(null, item);
};

function Offset(source, offset) {
  this.source = source;
  this.offset = offset;
}

utils.inherits(Offset, Proto);

Offset.prototype.nextObject = function(callback) {
  var self = this;
  var rest = this.offset;
  var source = this.source;
  callback = callback || NOP;

  if (rest > 0) {
    source.nextObject(iterator);
  } else {
    ready();
  }

  function iterator(err, item) {
    if (err) {
      callback(err); // error on read
    } else if (!item) {
      self.nextObject = through; // EOF
      callback();
    } else if (--rest > 0) {
      source.nextObject(iterator); // skip
    } else {
      ready();
    }
  }

  function ready() {
    self.nextObject = Proto.prototype.nextObject; // replace
    self.nextObject(callback);
  }
};

function Limit(source, limit) {
  this.source = source;
  this.limit = limit;
  this.rest = this.limit;
}

utils.inherits(Limit, Proto);

Limit.prototype.nextObject = function(callback) {
  var source = this.source;
  callback = callback || NOP;

  if (this.rest-- > 0) {
    source.nextObject(callback);
  } else {
    this.nextObject = through;
    callback();
  }
};

Limit.prototype.rewind = function() {
  this.rest = this.limit;
  Proto.prototype.rewind.call(this);
};

function Projection(source, projection) {
  this.source = source;
  this.projection = projection;
}

utils.inherits(Projection, Proto);

Projection.prototype.nextObject = function(callback) {
  var self = this;
  var projection = this.projection;

  if ('function' != typeof projection) {
    var err = new Error('invalid projection: ' + projection);
    callback(err);
    return;
  }

  this.source.nextObject(function(err, item) {
    if (err) {
      callback(err);
    } else if (!item) {
      self.nextObject = through; // EOF
      callback();
    } else {
      item = projection(item);
      callback(null, item);
    }
  });
};

function toArray(source, callback) {
  var buf = [];
  callback = callback || NOP;
  source.nextObject(iterator);

  function iterator(err, item) {
    // error on read
    if (err) {
      callback(err);
      return;
    }

    // last item
    if (!item) {
      callback(null, buf);
      return;
    }

    buf.push(item);

    source.nextObject(iterator);
  }
}

function through(callback) {
  if (callback) callback();
}

function NOP() {}