/*! stub.js */

/**
 * This mixin provides a series of stub methods which will be overrided by runtime [storage]{@linkcode storage}.
 *
 * @class stub
 * @mixin
 */

module.exports = function(methods) {
  methods = methods || {
    read: 1,
    write: 1,
    erase: 1,
    exist: 1,
    index: 1,
    find: 1,
    findOne: 1,
    count: 1,
    insert: 1,
    save: 1,
    update: 1,
    findAndModify: 1,
    remove: 1,
    ajax: 1
  };

  var mixin = {};
  for (var method in methods) {
    mixin[method] = not_implemented(method);
  }

  return mixin;
};

function not_implemented(method) {
  return function() {
    throw new Error('method not implemented: ' + method);
  };
}