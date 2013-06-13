/*! update_op.js */

/**
 * This provides an update operator parser. update() method uses this internally.
 *
 * @module update_op
 */

/**
 * This generates an update function from an operator object.
 *
 * @param {Object|Function} update - update operators
 * @returns {Function} map function generated
 */

exports.parser = function(update) {
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
};