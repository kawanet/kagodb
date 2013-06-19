/*! obop.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');

describe('ObOp Mixin:', function() {
  var opts = {
    storage: 'memory'
  };
  var collection = new KagoDB(opts);
  it('obop()', function(done) {
    var obop = collection.obop();
    assert.ok(obop, 'should return an obop instance');
    var ver = obop.system.version;
    assert.ok(ver, 'should have some version');
    var va = ver.split(/\./);
    var vv = (va[0] - 0 || 0) + (va[1] - 0 || 0) / 1000 + (va[2] - 0 || 0) / 1000000;
    assert.ok(vv >= 0.000003, 'should have version greater than 0.0.3: ' + ver);
    done();
  });

  it('sample code 1', function(done) {
    var obop = collection.obop();
    var src = [{
        a: 1
      }, {
        a: 2
      }, {
        a: 3
      }
    ];
    var func = obop.where({
      a: 2
    });
    assert.equal(typeof func, 'function', 'where should return a function');
    var out = src.filter(func);
    assert.equal(out.length, 1, 'filter test should success');
    assert.equal(out[0].a, 2, 'filter result should be correct');
    done();
  });

  it('sample code 2', function(done) {
    var obop = collection.obop();
    var list = [{
        name: "apple",
        price: 50
      }, {
        name: "orange",
        price: 10
      }, {
        name: "pineapple",
        price: 70
      }, {
        name: "grape",
        price: 30
      }
    ];
    var order = {
      price: 1
    };
    var out = list.sort(obop.order(order));
    assert.equal(out[0].name, 'orange', 'first one should be correct');
    assert.equal(out[3].name, 'pineapple', 'last one should be correct');
    done();
  });
});
