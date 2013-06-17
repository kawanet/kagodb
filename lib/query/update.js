/*! update.js */

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
  return mixin;
};

/**
 * This updates item(s) which matches the specified query.
 * $set, $unset, $inc, $push, $pull, $rename operators are available as update parameters.
 *
 * @method KagoDB.prototype.update
 * @param {Object|Function} condition - query selector or function
 * @param {Object|Function} update - update operator or function
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
  var collection = this;
  var pkey = this.pkey();
  var onwrite;

  if ('function' == typeof options && !callback) {
    callback = options;
    options = null;
  }

  update = this.obop().update(update);
  options = options || {};
  callback = callback || NOP;

  if (!pkey) {
    throw new Error('primary key not defined');
  }

  if (options.multi) {
    this.find(condition).each(updater);
  } else {
    onwrite = callback;
    this.findOne(condition, updater);
  }

  return this;

  function updater(err, item) {
    if (err) return callback(err);
    if (!item) return callback();
    var id = item[pkey];
    if (update) item = update(item);
    collection.write(id, item, onwrite);
  }
}

function NOP() {}
