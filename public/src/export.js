/*! export.js */

var KagoDB = window.KagoDB = require('../../bundle/browser');
KagoDB.set('jquery', window.jQuery);
KagoDB.set('superagent', window.superagent);
KagoDB.set('local_storage', window.localStorage || {});
