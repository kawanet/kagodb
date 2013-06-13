/*! insert.js */

var utils = require('../core/utils');
var ObjectId = require('../core/objectid');

/** This mixin provides insert() and save() method.
 * @class InsertMixin
 * @mixin
 */

module.exports = function() {
  var mixin = {};
  mixin.insert = insert;
  mixin.save = save;
  return mixin;
};

function insert(item, callback) {
  var self = this;
  var items = (item instanceof Array) ? item : [item];
  var pkey = self.pkey();

  if (!pkey) {
    throw new Error('primary key not defined');
  }

  var dup = {};
  utils.eachSeries(items, exist_iterator, write_all);
  return this;

  function exist_iterator(item, next) {
    var id = item[pkey];
    if ('undefined' === typeof id || id === null) {
      item[pkey] = new ObjectId();
      next();
    } else if (dup[id]) {
      var err = new Error('duplicated item ID: ' + id);
      next(err);
    } else {
      dup[id] = true;
      self.exist(id, function(err, exist) {
        if (!err && exist) {
          err = new Error('item already exist: ' + id);
        }
        next(err);
      });
    }
  }

  function write_all(err) {
    if (err) {
      callback(err);
    } else {
      utils.eachSeries(items, write_iterator, callback);
    }
  }

  function write_iterator(item, next) {
    var id = item[pkey];
    self.write(id, item, next);
  }
}

function save(item, callback) {
  var self = this;
  var pkey = self.pkey();

  if (!pkey) {
    throw new Error('primary key not defined');
  }

  var id = item[pkey];
  if (id) {
    self.write(id, item, callback);
  } else {
    self.insert(item, callback);
  }

  return this;
}

function NOP() {}