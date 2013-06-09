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
module.exports = KagoDB;
