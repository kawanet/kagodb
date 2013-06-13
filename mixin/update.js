/*! update.js */

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

exports.parser = parser;

function parser(update) {
  // function type
  if ('function' == typeof update) {
    return update;
  }

  // default operator
  update = update || {};

  // no operators: through
  if (!Object.keys(update)) {
    return null;
  }

  // other types than object
  if ('object' != typeof update) {
    throw new Error('invalid update: ' + update);
  }

  // supported operators
  var ope = {
    $set: 1,
    $unset: 1,
    $rename: 1,
    $push: 1,
    $inc: 1
  };

  // check operators supported or not
  for (var key in update) {
    if (ope[key] && 'object' === typeof update[key]) continue;
    throw new Error('invalid update operator: ' + key);
  }

  // update function
  return function(item) {
    var key, val;

    // through when empty
    if (!item) return item;

    // Sets the value of a field in an existing document.
    if (update.$set) {
      for (key in update.$set) {
        item[key] = update.$set[key];
      }
    }

    // Removes the specified field from an existing document.
    if (update.$unset) {
      for (key in update.$unset) {
        delete item[key];
      }
    }

    // Renames a field.
    if (update.$rename) {
      for (key in update.$rename) {
        val = update.$rename[key];
        item[val] = item[key];
        delete item[key];
      }
    }

    // Adds an item to an array.
    if (update.$push) {
      for (key in update.$push) {
        val = item[key];
        if (val instanceof Array) {
          // ok
        } else if ('undefined' == typeof val) {
          item[key] = [];
        } else {
          item[key] = [val];
        }
        val = update.$push[key];
        item[key].push(val);
      }
    }

    // Increments the value of the field by the specified amount.
    if (update.$inc) {
      for (key in update.$inc) {
        val = update.$inc[key];
        item[key] = (parseFloat(item[key]) || 0) + val;
      }
    }
    return item;
  };
}

function getUpdater(self, update, onwrite, callback) {
  var pkey = self.pkey();
  update = parser(update) || through;
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