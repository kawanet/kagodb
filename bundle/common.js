/*! common.js */

var Base = require('../core/base');
var storage = require('../mixin/storage');
var find = require('../mixin/find');
var pkey = require('../mixin/pkey');
var events = require('../mixin/events');
var model = require('../mixin/model');
var noop = require('../mixin/noop');
var update = require('../mixin/update');
var remove = require('../mixin/remove');
var insert = require('../mixin/insert');

var KagoDB = Base.inherit();

KagoDB.mixin(noop());
KagoDB.mixin(find());
KagoDB.mixin(insert());
KagoDB.mixin(update());
KagoDB.mixin(remove());
KagoDB.mixin(storage());
KagoDB.mixin(events());
KagoDB.mixin(pkey());
KagoDB.mixin(model());

module.exports = KagoDB;
