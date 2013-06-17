/*! find_and_modify.js */

/**
 * This mixin provides
 * [findAndModify()]{@linkcode KagoDB#findAndModify}
 * method.
 *
 * @class findAndModify
 * @mixin
 * @see http://mongodb.github.io/node-mongodb-native/api-generated/collection.html#findandmodify
 * @see http://docs.mongodb.org/manual/reference/operator/#update-operators
 */

module.exports = function() {
  var mixin = {};
  mixin.findAndModify = findAndModify;
  return mixin;
};

/**
 * This updates the first item which matches the specified condition.
 * This works similar to
 * [update()]{@linkcode KagoDB#update}
 * but update only the first item in the specified order.
 *
 * @method KagoDB.prototype.findAndModify
 * @param {Object|Function} condition - query selector or function
 * @param {Object|Function} sort - order parameters or function
 * @param {Object|Function} update - update operator or function
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
  var collection = this;
  var pkey = this.pkey();

  if ('function' == typeof options && !callback) {
    callback = options;
    options = null;
  }

  update = this.obop().update(update);
  options = options || {};
  options.limit = 1;
  options.sort = sort;
  callback = callback || NOP;

  if (!pkey) {
    throw new Error('primary key not defined');
  }

  this.findOne(condition, options, updater);
  return this;

  function updater(err, item) {
    if (err) return callback(err);
    if (!item) return callback();
    var id = item[pkey];
    if (update) item = update(item);
    collection.write(id, item, callback);
  }
}

function NOP() {}
