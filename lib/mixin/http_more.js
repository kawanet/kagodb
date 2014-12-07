/*! http_more.js */

var KagoDB = require('../core/base');
var utils = require('../core/utils');
var CursorBulk = require('../core/cursor_bulk');

module.exports = function() {
  var mixin = {};

  mixin.find = find;
  mixin.findOne = findOne;
  mixin.count = count;
  mixin.insert = insert;
  mixin.save = save;
  mixin.remove = remove;
  mixin.update = update;
  mixin.findAndModify = findAndModify;

  return mixin;
};

function find(condition, projection, options) {
  options = options || {};

  // wrap the current collection to override find() method with Ajax version of it
  var f = function() {};
  f.prototype = this;
  var collection = new f();
  collection.find = findAjax;

  // load bulk-version of cursor class
  return new CursorBulk(collection, condition, projection, options);
}

function findAjax(condition, projection, options) {
  var self = this;
  var url = this.http_endpoint();
  var data = this.http_param();
  data.options = options;
  data.method = 'find';
  if (condition) {
    data.condition = condition;
  }
  if (projection) {
    data.projection = projection;
  }
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };

  // dummy cursor object which has only toArray() method (function, in fact)
  var cursor = {};
  cursor.toArray = function(callback) {
    self.ajax(opts, after_ajax);

    function after_ajax(err, res) {
      callback = callback || NOP;
      if (err) {
        callback(err);
      } else if (!res || !res.data) {
        err = new Error('ajax response has no "data" property');
        callback(err);
      } else {
        var list = res.data;
        if (!(list instanceof Array) && list.length) {
          // jQuery may return an Array-like object
          list = Array.prototype.slice.call(list);
        }
        // ajax storages does not support decode method but supports unwrap
        if (self.unwrap) {
          var unwrap = self.unwrap.bind(self);
          list = list.map(unwrap);
        }
        callback(err, list);
      }
    }
  };
  return cursor;
}

function findOne(condition, options, callback) {
  if ('function' == typeof options && !callback) {
    callback = options;
    options = null;
  }
  options = options || {};

  var self = this;
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'findOne';
  if (condition) data.condition = condition;
  if (options) data.options = options;
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.ajax(opts, after_ajax);

  function after_ajax(err, item) {
    callback = callback || NOP;
    if (!err && self.unwrap) {
      // ajax storages does not support decode method but supports unwrap
      item = self.unwrap.call(self, item);
    }
    callback(err, item);
  }
}

function count(condition, options, callback) {
  if ('function' == typeof options && !callback) {
    callback = options;
    options = null;
  }
  options = options || {};

  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'count';
  if (condition) data.condition = condition;
  if (options) data.options = options;
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.ajax(opts, response_parser('count', callback));
}

function insert(item, callback) {
  var url = this.http_endpoint();
  if (this.wrap) {
    item = this.wrap(item);
  }
  var data = this.http_param();
  data.method = 'insert';
  data.content = item;
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.ajax(opts, response_parser('success', callback));
}

function save(item, callback) {
  var url = this.http_endpoint();
  if (this.wrap) {
    item = this.wrap(item);
  }
  var data = this.http_param();
  data.method = 'save';
  data.content = item;
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.ajax(opts, response_parser('success', callback));
}

function remove(condition, options, callback) {
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'remove';
  if (condition) data.condition = condition;
  if (options) data.options = options;
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.ajax(opts, response_parser('success', callback));
}

function update(condition, _update, options, callback) {
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'update';
  if (condition) data.condition = condition;
  data.update = _update;
  if (options) data.options = options;
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.ajax(opts, response_parser('success', callback));
}

function findAndModify(condition, sort, update, options, callback) {
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'findAndModify';
  if (condition) data.condition = condition;
  if (sort) data.sort = sort;
  data.update = update;
  if (options) data.options = options;
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.ajax(opts, response_parser('success', callback));
}

function response_parser(column, callback) {
  if (!callback) return;
  return function(err, res) {
    if (err) {
      callback(err);
    } else if (!column) {
      callback(null, res);
    } else if ('object' != typeof res) {
      callback();
    } else {
      callback(null, res[column]);
    }
  };
}

function NOP() {}
