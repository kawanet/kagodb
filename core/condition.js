/* condition.js */

// overriding find() method

exports.exporter = function() {
  var _find = this.find;
  if (!_find) {
    throw new Error('find() method not available');
  }
  this.find = function(condition) {
    var args = Array.prototype.slice.call(arguments);
    args[0] = conditionParser(args[0]);
    return _find.apply(this, args);
  };
};

function conditionParser(condition) {
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

  // more conditions:
  return function(item) {
    for (var key in condition) {
      if (item[key] != condition[key]) return false;
    }
    return true;
  };
}