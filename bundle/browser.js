/*! browser.js */

var Common = require('./common');
var KagoDB = Common.inherit();

KagoDB.bundle.utils = require('../core/utils');
KagoDB.bundle.objectid = require('../core/objectid');
KagoDB.bundle.version = require('../core/version');
KagoDB.bundle.memory = require('../storage/memory');
KagoDB.bundle.http_jquery = require('../storage/http_jquery');
KagoDB.bundle.http_superagent = require('../storage/http_superagent');
KagoDB.bundle.local_storage = require('../storage/local_storage');

module.exports = KagoDB;
