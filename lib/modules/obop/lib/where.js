/* where.js */

/**
 * This exports where() function which parses conditional operators a.k.a. query selectors.
 *
 * @module obop.where
 * @see http://docs.mongodb.org/manual/reference/operator/#query-selectors
 */

/**
 * This generates a conditional function from specified operator object.
 *
 * @param {Object|Function} condition - query parameters or function
 * @returns {Function} function for array.filter() etc.
 */

exports.where = function(condition) {
  // function type
  if ('function' == typeof condition) {
    return condition;
  }

  // default condition
  condition = condition || {};

  // other types than object
  if ('object' != typeof condition) {
    throw new Error('unknown condition: ' + condition);
  }

  var queries = Object.keys(condition);

  // no condition: every item OK
  if (!queries.length) {
    return null;
  }

  // one condition: faster
  if (queries.length == 1) {
    var key = queries[0];
    var val = condition[key];
    if ('object' != typeof val) {
      return function(item) {
        return (item[key] == val);
      };
    }
  }

  // more complex conditions:
  return function(item) {
    for (var key in condition) {
      if (item[key] != condition[key]) return false;
    }
    return true;
  };
};
