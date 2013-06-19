/*! obop.js */

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
