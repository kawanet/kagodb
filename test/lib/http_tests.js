/*! http_tests.js */

var assert = require('chai').assert;

module.exports = http_tests;

function http_tests(kit) {
  it('request/reqponse events fired', function(done) {
    var req;
    var res;
    kit.collection.on('request', function(_req) {
      req = _req;
      // console.error(req);
    });
    kit.collection.on('response', function(_res) {
      res = _res;
      // console.error(res);
    });
    kit.collection.index(function(err, list) {
      assert(!err, 'index() method should success');
      assert(req, 'request event should be fired');
      assert(res, 'response event should be fired');
      done();
    });
  });
}