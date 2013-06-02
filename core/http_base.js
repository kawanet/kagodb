/*! http_base.js */

module.exports = function() {
  var mixin = {};
  mixin.read = read;
  mixin.write = write;
  mixin.erase = erase;
  mixin.exist = exist;
  mixin.index = index;
  mixin.proxy_request = proxy_request;
  mixin.proxy_endpoint = proxy_endpoint;
  return mixin;
};

function read(id, callback) {
  callback = callback || NOP;
  var url = this.proxy_endpoint() + id;
  var opts = {
    method: 'GET',
    url: url
  };
  this.proxy_request(opts, callback);
}

function write(id, item, callback) {
  callback = callback || NOP;
  var url = this.proxy_endpoint() + id;
  var data = {
    method: 'write',
    content: item
  };
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.proxy_request(opts, callback);
}

function erase(id, callback) {
  callback = callback || NOP;
  var url = this.proxy_endpoint() + id;
  var data = {
    method: 'erase'
  };
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.proxy_request(opts, callback);
}

function exist(id, callback) {
  callback = callback || NOP;
  var url = this.proxy_endpoint() + id;
  var data = {
    method: 'exist'
  };
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.proxy_request(opts, function(err, res) {
    res = res || {};
    var flag = !! res.exist;
    callback(err, flag);
  });
}

function index(callback) {
  callback = callback || NOP;
  var url = this.proxy_endpoint();
  var data = {
    method: 'index'
  };
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.proxy_request(opts, function(err, res) {
    res = res || {};
    callback(err, res.index);
  });
}

function proxy_endpoint() {
  var endpoint = this.options.endpoint;
  if (!endpoint) {
    throw new Error('endpoint not defined');
  }
  return endpoint.replace(/\/*$/, '/');
}

function proxy_request(opts, callback) {
  throw new Error('request() not implemented');
}

function NOP() {}
