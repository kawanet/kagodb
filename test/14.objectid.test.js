/*! objectid.test.js */

var assert = require('chai').assert;
var ObjectID = require('../mixin/objectid').ObjectID;

ObjectID.prototype.__defineGetter__('generationTime', ObjectID.prototype.getGenerationTime);
ObjectID.prototype.__defineSetter__('generationTime', ObjectID.prototype.setGenerationTime);
ObjectID.prototype.__defineGetter__('id', ObjectID.prototype.toOctets);

var tests = require('./kangodb/objectid_test');

var pkg = {
  ObjectID: ObjectID
};

var config = {};
config.getMongoPackage = function() {
  return pkg;
};

describe('ObjectID', function() {
  Object.keys(tests).forEach(function(key) {
    var func = tests[key];
    it(key, function(done) {
      var test = {};
      test.ok = assert.ok;
      test.equal = assert.equal;
      test.done = done;
      func(config, test);
    });
  });
});