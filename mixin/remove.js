/*! remove.js */

/** This mixin provides remove() methods.
 * @class RemoveMixin
 * @mixin
 */

module.exports = function() {
  var mixin = {};
  mixin.remove = remove;
  return mixin;
};

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