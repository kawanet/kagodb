/*! common.js */

var Base = require('../lib/core/base');

var find = require('../lib/query/find');
var findAndModify = require('../lib/query/findAndModify');
var insert = require('../lib/query/insert');
var remove = require('../lib/query/remove');
var update = require('../lib/query/update');

var encode = require('../lib/mixin/encode');
var events = require('../lib/mixin/events');
var model = require('../lib/mixin/model');
var noop = require('../lib/mixin/noop');
var pkey = require('../lib/mixin/pkey');
var storage = require('../lib/mixin/storage');
var stub = require('../lib/mixin/stub');

var KagoDB = Base.inherit();

// base
KagoDB.mixin(noop());
KagoDB.mixin(stub());
KagoDB.mixin(encode());

// query
KagoDB.mixin(find());
KagoDB.mixin(findAndModify());
KagoDB.mixin(insert());
KagoDB.mixin(remove());
KagoDB.mixin(update());

// storage (this must come after query mixins)
KagoDB.mixin(storage());

// other mixins
KagoDB.mixin(events());
KagoDB.mixin(pkey());
KagoDB.mixin(model());

module.exports = KagoDB;
