/*! jquery.js */

var wrequire = require('wrequire');

/**
 * This mixin provides
 * [ajax()]{@linkcode KagoDB#ajax}
 * method which works with jQuery.
 *
 * @class jquery
 * @mixin
 * @see http://jquery.com
 * @see https://npmjs.org/package/jquery
 *
 * @example
 * var MyKago = KagoDB.inherit();
 * MyKago.mixin(KagoDB.bundle.jquery());
 * var collection = new MyKago();
 *
 * var options = {
 *   method: 'GET',
 *   url: 'http://graph.facebook.com/4',
 * };
 * collection.ajax(options, function(err, body) {
 *   console.log(body); // JSON
 * });
 *
 * @example
 * var opts = {
 *   storage: 'ajax',
 *   ajax: 'jquery',
 *   endpoint: 'http://localhost:3000/data/'
 * };
 *
 * var collection = new KagoDB(opts);
 *
 * collection.read('foo', function(err, item){
 *   // item =>  http://localhost:3000/data/foo
 * }); */

module.exports = function() {
  var mixin = {
    ajax: ajax
  };
  return mixin;
};

function ajax(opts, callback) {
  var self = this;
  var jopts = {};
  var jQuery = this.get('jquery');
  jQuery = jQuery || wrequire('jQuery', 'jquery');
  if (!jQuery) throw new Error('jQuery not loaded');
  if (self.emit) self.emit('ajax', opts);

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