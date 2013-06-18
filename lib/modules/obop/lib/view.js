/* view.js */

/**
 * This exports view() function which parses projection operators.
 *
 * @module obop.view
 */

/**
 * This generates a projection function from specified operator object.
 *
 * @param {Object|Function} projection - mapping parameters or function
 * @returns {Function} function for array.map() etc.
 */

exports.view = function(projection) {
  // function type
  if ('function' == typeof projection) {
    return projection;
  }

  // default projection
  projection = projection || {};

  // other types than object
  if ('object' != typeof projection) {
    throw new Error('unknown projection: ' + projection);
  }

  var queries = Object.keys(projection);

  // no projection: all properties
  if (!queries.length) {
    return null;
  }

  // one property: faster
  if (queries.length == 1) {
    var key = queries[0];
    if (projection[key]) {
      return function(item) {
        var out = {};
        out[key] = item[key];
        return out;
      };
    }
  }

  // more properties
  return function(item) {
    var out = {};
    for (var key in projection) {
      if (projection[key]) {
        out[key] = item[key];
      }
    }
    return out;
  };
};
