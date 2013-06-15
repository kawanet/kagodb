/* sort_op.js */

/**
 * This provides a sort operator parser. find() method uses this internally.
 *
 * @module sort_op
 */

/**
 * This generates a sort function from an operator object.
 *
 * @param {Object|Function} sort - order parameters
 * @returns {Function} map function generated
 */

exports.parser = function(sort) {
  // function type
  if ('function' == typeof sort) {
    return sort;
  }

  // default sort
  sort = sort || {};

  // other types than object
  if ('object' != typeof sort) {
    throw new Error('unknown sort operator: ' + sort);
  }

  var fields = Object.keys(sort);

  // no sort operator
  if (!fields.length) {
    return null;
  }

  // one field: faster
  if (fields.length == 1) {
    var key = fields[0];
    if (fields[key]) {
      var ret = sort[key];
      return function(a, b) {
        return (a[key] < b[key]) ? -ret : (a[key] > b[key]) ? ret : 0;
      };
    }
  }

  // more fields
  return function(a, b) {
    for(var key in sort) {
      if (a[key] < b[key]) {
        return -sort[key];
      } else if (a[key] > b[key]) {
        return sort[key];
      }
    }
  };
};