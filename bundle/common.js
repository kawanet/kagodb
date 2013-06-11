/*! common.js */

var Base = require('../core/base');
var storage = require('../mixin/storage');
var find = require('../mixin/find');
var version = require('../mixin/version');
var pkey = require('../mixin/pkey');
var objectid = require('../mixin/objectid');
var events = require('../mixin/events');
var utils = require('../core/utils');
var model = require('../mixin/model');
var noop = require('../mixin/noop');

var KagoDB = Base.inherit();

KagoDB.mixin(noop());
KagoDB.mixin(find());
KagoDB.mixin(storage());
KagoDB.mixin(version());
KagoDB.mixin(utils());
KagoDB.mixin(events());
KagoDB.mixin(pkey());
KagoDB.mixin(objectid());
KagoDB.mixin(model());

module.exports = KagoDB;
