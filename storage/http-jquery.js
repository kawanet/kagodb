/*! http-jquery.js */

module.exports = ProxyJquery;

var Stores = {};

function ProxyJquery(options) {
  if (!(this instanceof ProxyJquery)) return new ProxyJquery(options);
  this.options = options || {};
}

ProxyJquery.prototype.read = read;
ProxyJquery.prototype.write = write;
ProxyJquery.prototype.erase = erase;
ProxyJquery.prototype.exist = exist;
ProxyJquery.prototype.index = index;

function read(id, callback) {
  callback = callback || NOP;
  var url = this.endpoint() + id;
  var opts = {
    method: 'GET',
    url: url
  };
  this.request(opts, callback);
}

function write(id, item, callback) {
  callback = callback || NOP;
  var url = this.endpoint() + id;
  var data = {
    method: 'write',
    content: item
  };
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.request(opts, callback);
}

function erase(id, callback) {
  callback = callback || NOP;
  var url = this.endpoint() + id;
  var data = {
    method: 'erase'
  };
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, callback);
}

function exist(id, callback) {
  callback = callback || NOP;
  var url = this.endpoint() + id;
  var data = {
    method: 'exist'
  };
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, function(err, res) {
    res = res || {};
    var flag = !! res.exist;
    callback(err, flag);
  });
}

function index(callback) {
  callback = callback || NOP;
  var url = this.endpoint();
  var data = {
    method: 'index'
  };
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, function(err, res) {
    res = res || {};
    callback(err, res.index);
  });
}

ProxyJquery.prototype.endpoint = function() {
  var endpoint = this.options.endpoint;
  if (!endpoint) {
    throw new Error('endpoint not defined');
  }
  return endpoint.replace(/\/*$/, '/');
}

ProxyJquery.prototype.request = function(opts, callback) {
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

function NOP() {}