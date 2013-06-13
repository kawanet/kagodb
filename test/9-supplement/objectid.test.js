/*! objectid.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');
var ObjectID = KagoDB.bundle.objectid;

ObjectID.prototype.__defineGetter__('generationTime', ObjectID.prototype.getGenerationTime);
ObjectID.prototype.__defineSetter__('generationTime', ObjectID.prototype.setGenerationTime);
ObjectID.prototype.__defineGetter__('id', ObjectID.prototype.toOctets);

var tests = require('./mongodb/objectid_test');

var pkg = {
  ObjectID: ObjectID
};

var config = {};
config.getMongoPackage = function() {
  return pkg;
};

describe('MongoDB Tests: (ObjectID)', function() {
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