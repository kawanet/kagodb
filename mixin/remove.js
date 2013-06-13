/*! remove.js */

/**
 * This mixin provides
 * [remove()]{@linkcode KagoDB#remove}
 * method.
 *
 * @class remove
 * @mixin
 * @example
 * var collection = new KagoDB();
 *
 * collection.remove({name: 'john'}, true, function(err){
 *   console.log(err);
 * });
 */

module.exports = function() {
  var mixin = {};
  mixin.remove = remove;
  return mixin;
};

/**
 * This removes item(s) which matches the specified query.
 *
 * @method KagoDB.prototype.remove
 * @param {Object|Function} condition - query selector
 * @param {Bool} [justOne] - true when remove multiple items at once
 * @param {Function} [callback] - function(err) {}
 * @example
 * var collection = new KagoDB();
 *
 * collection.remove({name: 'john'}, true, function(err){
 *   console.log(err);
 * });
 */

function remove(condition, justOne, callback) {
  var remover;

  if (!justOne) {
    remover = getRemover(this, null, callback);
    if (remover) this.find(condition).each(remover);
  } else {
    remover = getRemover(this, callback, callback);
    if (remover) this.findOne(condition, remover);
  }

  return this;
}

function getRemover(self, onerase, callback) {
  var pkey = self.pkey();
  if (!pkey) {
    throw new Error('primary key not defined');
  }

  callback = callback || NOP;

  return function(err, item) {
    if (err) return callback(err);
    if (!item) return callback();
    var id = item[pkey];
    self.erase(id, onerase);
  };
}

function NOP() {}