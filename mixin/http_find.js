/*! http_find.js */

module.exports = function() {
  var mixin = {};
  mixin.find = find;
  return mixin;
};

function find(condition, projection) {
  return new HCursor(this, condition, projection);
}

function HCursor(collection, condition, projection) {
  this.collection = collection;
  this._condition = condition;
  this._projection = projection;
}

HCursor.prototype.toArray = function(callback) {
  callback = callback || NOP;
  if (this.cache) {
    var list = [].concat(this.cache);
    callback(list);
  } else {
    this._toArray(function(err, list) {
      if (!err && list) {
        this.cache = list;
        list = [].concat(this.cache);
      }
      callback(err, list);
    });
  }
};

HCursor.prototype._toArray = function(callback) {
  var collection = this.collection;
  var url = collection.http_endpoint();
  var data = collection.http_param();
  data.method = 'find';
  if (this._condition) data.condition = this._condition;
  if (this._projection) data.projection = this._projection;
  if (this._sort) data.sort = this._sort;
  if ('undefined' !== typeof this._offset) data.offset = this._offset;
  if ('undefined' !== typeof this._limit) data.limit = this._limit;
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  collection.request(opts, function(err, res) {
    if (err) {
      callback(err);
    } else {
      callback(null, res.data);
    }
  });
};

HCursor.prototype.count = function(callback) {
  this.toArray(function(err, list) {
    if (err) {
      callback(err);
    } else {
      list = list || [];
      callback(null, list.length);
    }
  });
};

HCursor.prototype.sort = function(sort) {
  this._sort = sort;
  return this;
};

HCursor.prototype.offset = function(offset) {
  this._offset = offset;
  return this;
};

HCursor.prototype.limit = function(limit) {
  this._limit = limit;
  return this;
};

HCursor.prototype.each = function(callback) {
  var self = this;
  callback = callback || NOP;

  this.nextObject(iterator);

  function iterator(err, item) {
    callback(err, item);
    if (!err && item) self.nextObject(iterator);
  }
};

HCursor.prototype.nextObject = function(callback) {
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

HCursor.prototype.rewind = function(callback) {
  delete this.list;
};

function NOP() {}