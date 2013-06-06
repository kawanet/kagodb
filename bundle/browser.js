/*! browser.js */

var Base = require('../core/base');
var storage = require('../mixin/storage');
var find = require('../mixin/find');
var version = require('../mixin/version');
var pkey = require('../mixin/pkey');

var KagoDB = Base.inherit();
KagoDB.mixin(version());
KagoDB.mixin(find());
KagoDB.mixin(storage());
KagoDB.mixin(pkey());

var preload = {
  'memory': require('../storage/memory'),
  'http_jquery': require('../storage/http_jquery'),
  'local_storage': require('../storage/local_storage')
};
KagoDB.set('storage_preload', preload);

module.exports = KagoDB;
