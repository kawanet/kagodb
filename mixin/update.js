/*! update.js */

var update_op = require('../core/update_op');

/**
 * This mixin provides
 * [update()]{@linkcode KagoDB#update} and
 * [findAndModify()]{@linkcode KagoDB#findAndModify}
 * methods.
 *
 * @class update
 * @mixin
 * @see http://docs.mongodb.org/manual/reference/operator/#update-operators
 * @example
 * var collection = new KagoDB(opts);
 *
 * var query = {
 *   name: 'apple'
 * };
 * var update = {
 *   $inc: {
 *     stock: -1
 *   }
 * };
 * collection.update(query, update, null, function(err){
 *   console.log(err);
 * });
 */

module.exports = function() {
  var mixin = {};
  mixin.update = _update;
  mixin.findAndModify = findAndModify;
  return mixin;
};

/**
 * This updates item(s) which matches the specified query.
 * $set, $unset, $inc, $push, $pull, $rename operators are available as update parameters.
 *
 * @method KagoDB.prototype.update
 * @param {Object|Function} condition - query selector or function
 * @param {Object|Function} update - update parameters or function
 * @param {Object} [options] - update options: multi
 * @param {Function} [callback] - function(err) {}
 * @see http://docs.mongodb.org/manual/reference/operator/#update-operators
 * @example
 * var collection = new KagoDB();
 *
 * var query = {
 *   name: 'John'
 * };
 * var update = {
 *   $set: {
 *     child: 'Sean'
 *   },
 *   $inc: {
 *     age: 1
 *   }
 * };
 * var options = {
 *   multi: false
 * };
 * collection.update(query, update, options, function(err){
 *   console.log(err);
 * });
 */

function _update(condition, update, options, callback) {
  var updater;

  options = options || {};

  if (options.multi) {
    updater = getUpdater(this, update, null, callback);
    if (updater) this.find(condition).each(updater);
  } else {
    updater = getUpdater(this, update, callback, callback);
    if (updater) this.findOne(condition, updater);
  }

  return this;
}

/**
 * This updates the first item which matches the specified condition.
 * This works similar to
 * [update()]{@linkcode KagoDB#update}
 * but update only the first item in the specified order.
 *
 * @method KagoDB.prototype.findAndModify
 * @param {Object|Function} condition - query selector or function
 * @param {Object|Function} sort - order parameters or function
 * @param {Object|Function} update - update parameters or function
 * @param {Object} [options] - update options
 * @param {Function} [callback] - function(err) {}
 * @example
 * var collection = new KagoDB();
 *
 * var query = {
 *   type: 'book',
 *   reading: false
 * };
 * var order = {
 *   published_at: 1
 * };
 * var update = {
 *   $set: {
 *     reading: true
 *   }
 * };
 * collection.findAndModify(query, order, update, null, function(err){
 *   console.log(err);
 * });
 */

function findAndModify(condition, sort, update, options, callback) {
  var pkey = this.pkey();
  var updater = getUpdater(this, update, callback, callback);
  if (updater) this.find(condition).sort(sort).nextObject(updater);
  return this;
}

function getUpdater(self, update, onwrite, callback) {
  var pkey = self.pkey();
  update = update_op.parser(update) || through;
  callback = callback || NOP;

  if (!pkey) {
    throw new Error('primary key not defined');
  }

  return function(err, item) {
    if (err) return callback(err);
    if (!item) return callback();
    var id = item[pkey];
    item = update(item);
    self.write(id, item, onwrite);
  };
}

function through(item) {
  return item;
}

function NOP() {}