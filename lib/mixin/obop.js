/*! obop.js */

/**
 * This mixin provides
 * [obop()]{@linkcode KagoDB#obop}
 * method which returns an
 * [obop]{@linkcode https://github.com/kawanet/obop} instance.
 *
 * @class obop
 * @mixin
 * @see http://kawanet.github.io/obop/
 * @example
 * var collection = new KagoDB({storage: 'memory'});
 * var obop = collection.obop();
 *
 * var list = [
 *   { name: "apple", price: 50 },
 *   { name: "orange", price: 10 },
 *   { name: "pineapple", price: 70 },
 *   { name: "grape", price: 30 }
 * ];
 *
 * var order = { price: 1 };
 * var out2 = list.sort(obop.order(order));
 * console.log(out2);
 */

/**
 * This returns a cached instance of
 * [obop]{@linkcode https://github.com/kawanet/obop} class.
 *
 * @method KagoDB.prototype.obop
 * @returns {obop} [obop]{@linkcode https://github.com/kawanet/obop} instance
 * @example
 * var collection = new KagoDB({storage: 'memory'});
 * var obop = collection.obop();
 *
 * var src = [ { a: 1 }, { a: 2 }, { a: 3 } ];
 * var func = obop.where( { a: 2 } );
 * var out = src.filter(func);
 * // => [ { a: 2 } ]
 */

var _obop = require('obop');

module.exports = function() {
  return {
    obop: obop
  };

  function obop() {
    if (obop._) return obop._;
    obop._ = new _obop();
    return obop._;
  }
};
