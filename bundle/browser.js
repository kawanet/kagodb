/*! browser.js */

var Base = require('../core/base');
var storage = require('../mixin/storage');
var cursor = require('../mixin/find');

var KagoDB = Base.inherit();
KagoDB.mixin(storage());
KagoDB.mixin(cursor());

var preload = {
  'memory': require('../storage/memory'),
  'http-jquery': require('../storage/http-jquery')
};
KagoDB.set('storage-preload', preload);

module.exports = KagoDB;