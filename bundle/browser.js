/*! browser.js */

var Common = require('./common');

var preload = {
  'memory': require('../storage/memory'),
  'http_jquery': require('../storage/http_jquery'),
  'http_superagent': require('../storage/http_superagent'),
  'local_storage': require('../storage/local_storage')
};

var KagoDB = Common.inherit();
KagoDB.set('storage_preload', preload);

var _window = require('../core/window');
KagoDB.set('jquery', _window.jQuery);
KagoDB.set('superagent', _window.superagent);
KagoDB.set('local_storage', _window.localStorage || {});

module.exports = KagoDB;
