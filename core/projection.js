/* projection.js */

/** Projection parser.
 * @class Projection
 */

/**
 * This generates a map function from an object given.
 * @method Projection.parser
 * @param {Function} projection - output properties
 * @returns {Function} map function generated
 */

exports.parser = function(projection) {
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
    for(var key in projection) {
      if (projection[key]) {
        out[key] = item[key];
      }
    }
    return out;
  };
};