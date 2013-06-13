/*! insert.js */

var utils = require('../core/utils');
var ObjectId = require('../core/objectid');

/**
 * This mixin provides
 * [insert()]{@linkcode KagoDB#insert} and
 * [save()]{@linkcode KagoDB#save} methods.
 *
 * @class insert
 * @mixin
 * @example
 * var opts = {
 *   storage: 'memory',
 *   primary_key: '_id' // primary key like MongoDB does
 * };
 * var collection = new KagoDB(opts);
 *
 * var items = [
 *   { name: 'Apple' },
 *   { name: 'Orange' },
 *   { name: 'Grape' }
 * };
 *
 * collection.insert(items, function(err) {
 *   console.log(err || 'no error'); // bulk insert
 * });
 */

module.exports = function() {
  var mixin = {};
  mixin.insert = insert;
  mixin.save = save;
  return mixin;
};

/**
 * This inserts an item to the collection.
 * This requires a primary key defined.
 *
 * @method KagoDB.prototype.insert
 * @param {Object|Array} item - an item or an array of items
 * @param {Function} [callback] - function(err) {}
 * @return {KagoDB} for chaining
 * @example
 * var opts = {
 *   storage: 'memory',
 *   primary_key: '_id' // primary key like MongoDB does
 * };
 * var collection = new KagoDB(opts);
 *
 * var item = {
 *   name: 'Apple'
 * };
 *
 * collection.insert(item, function(err) {
 *   console.log(err || 'no error');
 * });
 */

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

/**
 * This inserts or updates an item to the collection.
 * This requires a primary key defined.
 *
 * @method KagoDB.prototype.save
 * @param {Object} item - an item
 * @param {Function} [callback] - function(err) {}
 * @return {KagoDB} for chaining
 * @example
 * var opts = {
 *   storage: 'memory',
 *   primary_key: 'name'
 * };
 * var collection = new KagoDB(opts);
 *
 * var item = {
 *   name: 'Apple'
 * };
 *
 * collection.save(item, function(err) {
 *   collection.save(item, function(err) {
 *     console.log(err || 'no error');
 *   });
 * });
 */

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