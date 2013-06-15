/*! browser.js */

var Common = require('./common');
var KagoDB = Common.inherit();

// bundle some mixins which could run on web browsers
KagoDB.bundle.deny = require('../lib/mixin/deny');
KagoDB.bundle.http_jquery = require('../lib/storage/http_jquery');
KagoDB.bundle.http_superagent = require('../lib/storage/http_superagent');
KagoDB.bundle.local_storage = require('../lib/storage/local_storage');
KagoDB.bundle.memory = require('../lib/storage/memory');
KagoDB.bundle.objectid = require('../lib/core/objectid');
KagoDB.bundle.system = require('../lib/core/system');
KagoDB.bundle.utils = require('../lib/core/utils');

module.exports = KagoDB;