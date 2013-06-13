/*! update.js */

var update_op = require('../core/update_op');

/** This mixin provides update() methods.
 * @class UpdateMixin
 * @mixin
 */

module.exports = function() {
  var mixin = {};
  mixin.update = _update;
  mixin.findAndModify = findAndModify;
  return mixin;
};

function _update(condition, update, options, callback) {
  var updater;

  options = options || {};

  if (options.multiple) {
    updater = getUpdater(this, update, null, callback);
    if (updater) this.find(condition).each(updater);
  } else {
    updater = getUpdater(this, update, callback, callback);
    if (updater) this.findOne(condition, updater);
  }

  return this;
}

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
    error('primary key not defined', callback);
    return;
  }

  return function(err, item) {
    if (err) return callback(err);
    if (!item) return callback();
    var id = item[pkey];
    item = update(item);
    self.write(id, item, onwrite);
  };
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

function through(item) {
  return item;
}

function NOP() {}