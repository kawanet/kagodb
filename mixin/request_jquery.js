/*! request_jquery.js */

module.exports = function() {
  var mixin = {
    request: request
  };
  return mixin;
};

function request(opts, callback) {
  var self = this;
  var jopts = {};
  var jQuery = this.get('jquery');

  // var jquery_path = 'jquery';
  // jQuery = jQuery || require(jquery_path);

  if (!jQuery) throw new Error('jQuery not loaded');

  // create a HTTP request
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
  if (self.emit) self.emit('request', jopts);

  // perform a HTTP request
  jQuery.ajax(jopts).fail(function(jqXHR, status, error) {
    if (self.emit) self.emit('response', jqXHR);
    if (!(error instanceof Error)) {
      jqXHR = jqXHR || {};
      status = jqXHR.status || status;
      error = jqXHR.responseText || error || '';
      error = new Error(status + ' ' + error);
    }
    callback(error);
  }).done(function(data, status, jqXHR) {
    if (self.emit) self.emit('response', jqXHR);
    callback(null, data);
  });
}