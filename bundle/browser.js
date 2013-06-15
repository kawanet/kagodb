/*! browser.js */

var Common = require('./common');
var KagoDB = Common.inherit();

// bundle some mixins which could run on web browsers
KagoDB.bundle.deny = require('../lib/mixin/deny');
KagoDB.bundle.jquery = require('../lib/ajax/jquery');
KagoDB.bundle.superagent = require('../lib/ajax/superagent');
KagoDB.bundle.ajax = require('../lib/storage/ajax');
KagoDB.bundle.local_storage = require('../lib/storage/local_storage');
KagoDB.bundle.memory = require('../lib/storage/memory');
KagoDB.bundle.objectid = require('../lib/core/objectid');
KagoDB.bundle.system = require('../lib/core/system');
KagoDB.bundle.utils = require('../lib/core/utils');

module.exports = KagoDB;