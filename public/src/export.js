/*! export.js */

var KagoDB = window.KagoDB = require('../../bundle/browser');
KagoDB.set('jquery', window.jQuery);
KagoDB.set('local_storage', window.localStorage || {})
