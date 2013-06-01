/*! http-jquery.js */

var utils = require('../core/utils');
var ProxyBase = require('./http-base');

module.exports = utils.inherits(ProxyJQuery, ProxyBase);

function ProxyJQuery(options) {
  if (!(this instanceof ProxyJQuery)) return new ProxyJQuery(options);
  this.options = options || {};
}

ProxyJQuery.prototype.request = function(opts, callback) {
  var jopts = {};
  jopts.type = opts.method || 'GET';
  jopts.url = opts.url;
  jopts.dataType = 'json';
  if (opts.json) {
    jopts.headers = {
      'Content-Type': 'application/json'
    };
    jopts.data = JSON.stringify(opts.json);
  } else if (opts.form) {
    jopts.data = opts.form;
  }
  var jQuery = this.options.jquery;
  if (!jQuery) throw new Error('jQuery not loaded');
  jQuery.ajax(jopts).fail(function(jqXHR, status, error) {
    if (!(error instanceof Error)) {
      jqXHR = jqXHR || {};
      status = jqXHR.status || status;
      error = jqXHR.responseText || error || '';
      error = new Error(status + ' ' + error);
    }
    callback(error);
  }).done(function(data, status, jqXHR) {
    callback(null, data);
  });
};