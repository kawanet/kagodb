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
  var opt = {
    type: 'GET',
    url: url,
    dataType: 'json'
  };
  var jQuery = this.options.jquery;
  if (!jQuery) throw new Error('jQuery not loaded');
  jQuery.ajax(opt).fail(function(jqXHR, status, error) {
    callback(ajaxFail(jqXHR, status, error));
  }).done(function(data, status, jqXHR) {
    // console.error(jqXHR.responseText);
    callback(null, data);
  });
}

function write(id, item, callback) {
  callback = callback || NOP;
  var url = this.endpoint() + id;
  var data = {
    method: 'write',
    content: item
  };
  var opt = {
    headers: {
      'Content-Type': 'application/json'
    },
    type: 'POST',
    url: url,
    data: JSON.stringify(data)
  };
  var jQuery = this.options.jquery;
  if (!jQuery) throw new Error('jQuery not loaded');
  jQuery.ajax(opt).fail(function(jqXHR, status, error) {
    callback(ajaxFail(jqXHR, status, error));
  }).done(function(data, status, jqXHR) {
    // console.error(jqXHR.responseText);
    callback();
  });
}

function erase(id, callback) {
  callback = callback || NOP;
  var url = this.endpoint() + id;
  var opt = {
    type: 'POST',
    url: url,
    data: {
      method: 'erase'
    }
  };
  var jQuery = this.options.jquery;
  if (!jQuery) throw new Error('jQuery not loaded');
  jQuery.ajax(opt).fail(function(jqXHR, status, error) {
    callback(ajaxFail(jqXHR, status, error));
  }).done(function(data, status, jqXHR) {
    // console.error(jqXHR.responseText);
    callback();
  });
}

function exist(id, callback) {
  callback = callback || NOP;
  var url = this.endpoint() + id;
  var opt = {
    type: 'POST',
    url: url,
    data: {
      method: 'exist'
    }
  };
  var jQuery = this.options.jquery;
  if (!jQuery) throw new Error('jQuery not loaded');
  jQuery.ajax(opt).fail(function(jqXHR, status, error) {
    callback(ajaxFail(jqXHR, status, error));
  }).done(function(data, status, jqXHR) {
    // console.error(jqXHR.responseText);
    data = data || {};
    var flag = !! data.exist;
    callback(null, flag);
  });
}

function index(callback) {
  callback = callback || NOP;
  var url = this.endpoint();
  var opt = {
    type: 'POST',
    url: url,
    data: {
      method: 'index'
    }
  };
  var jQuery = this.options.jquery;
  if (!jQuery) throw new Error('jQuery not loaded');
  jQuery.ajax(opt).fail(function(jqXHR, status, error) {
    callback(ajaxFail(jqXHR, status, error));
  }).done(function(data, status, jqXHR) {
    data = data || {};
    callback(null, data.index);
  });
}

ProxyJquery.prototype.endpoint = function() {
  var endpoint = this.options.endpoint;
  if (!endpoint) {
    throw new Error('endpoint not defined');
  }
  return endpoint.replace(/\/*$/, '/');
}

function ajaxFail(jqXHR, status, error) {
  if (!(error instanceof Error)) {
    jqXHR = jqXHR || {};
    status = jqXHR.status || status;
    error = jqXHR.responseText || error || '';
    error = new Error(status + ' ' + error);
  }

  return error;
}

function NOP() {}