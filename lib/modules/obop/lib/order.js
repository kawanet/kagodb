/* order.js */

/**
 * This exports order() function which parses sort operators.
 *
 * @module obop.order
 */

/**
 * This generates an order function from specified operator object.
 *
 * @param {Object|Function} order - sort parameters or function
 * @returns {Function} function for array.sort() etc.
 */

exports.order = function(sort) {
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
