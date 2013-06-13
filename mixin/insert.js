/*! insert.js */

var utils = require('../core/utils');
var ObjectId = require('../core/objectid');

/** This mixin provides insert() methods.
 * @class InsertMixin
 * @mixin
 */

module.exports = function() {
  var mixin = {};
  mixin.insert = insert;
  return mixin;
};

function insert(item, callback) {
  var self = this;
  var items = (item instanceof Array) ? item : [item];
  var pkey = self.pkey();

  if (!pkey) {
    error('primary key not defined', callback);
    return;
  }

  utils.eachSeries(items, iterator, callback);

  function iterator(item, next) {
    var id = item[pkey];
    if ('undefined' === typeof id || id === null) {
      item[pkey]  = id = new ObjectId();
    }
    self.write(id, item, next);
  }

  return this;
}

function error(err, callback) {
  callback = callback || NOP;
  if ('string' === typeof err) {
    err = new Error(err);
  }
  if (callback === NOP) {
    throw err;
  } else {
    callback(err);
  }
}

function NOP() {}