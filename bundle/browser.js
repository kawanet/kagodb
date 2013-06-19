/*! browser.js */

var Common = require('./common');
var KagoDB = Common.inherit();

KagoDB.bundle.jquery = require('../lib/ajax/jquery');
// KagoDB.bundle.request = require('../lib/ajax/request');
KagoDB.bundle.superagent = require('../lib/ajax/superagent');
KagoDB.bundle.base = require('../lib/core/base');
KagoDB.bundle.cursor = require('../lib/core/cursor');
KagoDB.bundle.cursor_bulk = require('../lib/core/cursor_bulk');
KagoDB.bundle.objectid = require('../lib/core/objectid');
KagoDB.bundle.system = require('../lib/core/system');
KagoDB.bundle.utils = require('../lib/core/utils');
KagoDB.bundle.deny = require('../lib/mixin/deny');
KagoDB.bundle.dynamic_ajax = require('../lib/mixin/dynamic_ajax');
KagoDB.bundle.dynamic_mixin = require('../lib/mixin/dynamic_mixin');
KagoDB.bundle.dynamic_storage = require('../lib/mixin/dynamic_storage');
KagoDB.bundle.encode = require('../lib/mixin/encode');
KagoDB.bundle.events = require('../lib/mixin/events');
// KagoDB.bundle.file_base = require('../lib/mixin/file_base');
KagoDB.bundle.http_more = require('../lib/mixin/http_more');
KagoDB.bundle.init = require('../lib/mixin/init');
KagoDB.bundle.intercept_mixin = require('../lib/mixin/intercept_mixin');
KagoDB.bundle.model = require('../lib/mixin/model');
KagoDB.bundle.noop = require('../lib/mixin/noop');
KagoDB.bundle.obop = require('../lib/mixin/obop');
KagoDB.bundle.pkey = require('../lib/mixin/pkey');
KagoDB.bundle.stub = require('../lib/mixin/stub');
KagoDB.bundle.count = require('../lib/query/count');
KagoDB.bundle.find = require('../lib/query/find');
KagoDB.bundle.find_and_modify = require('../lib/query/find_and_modify');
KagoDB.bundle.find_one = require('../lib/query/find_one');
KagoDB.bundle.insert = require('../lib/query/insert');
KagoDB.bundle.remove = require('../lib/query/remove');
KagoDB.bundle.update = require('../lib/query/update');
KagoDB.bundle.ajax = require('../lib/storage/ajax');
// KagoDB.bundle.json = require('../lib/storage/json');
KagoDB.bundle.local_storage = require('../lib/storage/local_storage');
KagoDB.bundle.memory = require('../lib/storage/memory');
// KagoDB.bundle.yaml = require('../lib/storage/yaml');
// KagoDB.bundle.webapi = require('../lib/webapi/webapi');
// KagoDB.bundle.webmethods = require('../lib/webapi/webmethods');

module.exports = KagoDB;
