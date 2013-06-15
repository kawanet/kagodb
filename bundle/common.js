/*! common.js */

var Base = require('../lib/core/base');

var find = require('../lib/query/find');
var find_and_modify = require('../lib/query/find_and_modify');
var insert = require('../lib/query/insert');
var remove = require('../lib/query/remove');
var update = require('../lib/query/update');

var dynamic_ajax = require('../lib/mixin/dynamic_ajax');
var dynamic_storage = require('../lib/mixin/dynamic_storage');
var encode = require('../lib/mixin/encode');
var events = require('../lib/mixin/events');
var init = require('../lib/mixin/init');
var model = require('../lib/mixin/model');
var noop = require('../lib/mixin/noop');
var pkey = require('../lib/mixin/pkey');
var stub = require('../lib/mixin/stub');

var KagoDB = Base.inherit();

// base
KagoDB.mixin(noop());
KagoDB.mixin(init());
KagoDB.mixin(stub());
KagoDB.mixin(encode());

// query
KagoDB.mixin(find());
KagoDB.mixin(find_and_modify());
KagoDB.mixin(insert());
KagoDB.mixin(remove());
KagoDB.mixin(update());

// storage (this must come after query mixins)
KagoDB.mixin(dynamic_storage());
KagoDB.mixin(dynamic_ajax());

// other mixins
KagoDB.mixin(events());
KagoDB.mixin(pkey());
KagoDB.mixin(model());

module.exports = KagoDB;
