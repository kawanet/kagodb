/*! browser.js */

var Base = require('../core/base');
var storage = require('../mixin/storage');
var find = require('../mixin/find');
var version = require('../mixin/version');
var pkey = require('../mixin/pkey');
var objectid = require('../mixin/objectid');
var events = require('../mixin/events');

var KagoDB = Base.inherit();

KagoDB.mixin(find());
KagoDB.mixin(storage());
KagoDB.mixin(version());
KagoDB.mixin(events());
KagoDB.mixin(pkey());
KagoDB.mixin(objectid());

var preload = {
  'memory': require('../storage/memory'),
  'http_jquery': require('../storage/http_jquery'),
  'local_storage': require('../storage/local_storage')
};
KagoDB.set('storage_preload', preload);

module.exports = KagoDB;
