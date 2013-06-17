/*! obop.js */

module.exports = function() {
  return {
    obop: obop
  };
};

function obop() {
  if (!(this instanceof obop)) return new obop();
}

obop.prototype = require('../modules/obop');
