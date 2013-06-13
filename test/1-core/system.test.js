/*! system.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');

describe('System:', function() {
  describe('via bundle', function() {
    system_tests(KagoDB.bundle.system);
  });

  describe('via instance bundle', function() {
    system_tests(KagoDB().bundle.system);
  });
});

function system_tests(system) {
  it('version', function(done) {
    assert(system.version(), 'version should return a version');
    done();
  });
}