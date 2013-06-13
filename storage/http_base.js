/*! http_base.js */

var utils = require('../core/utils');

module.exports = function() {
  var mixin = {};
  mixin.read = read;
  mixin.write = write;
  mixin.erase = erase;
  mixin.exist = exist;
  mixin.index = index;
  mixin.request = request;
  mixin.http_endpoint = http_endpoint;
  mixin.http_param = http_param;
  return mixin;
};

function read(id, callback) {
  callback = callback || NOP;
  var url = this.http_endpoint() + id;
  var data = this.http_param();
  var opts = {
    method: 'GET',
    url: url,
  };
  if (Object.keys(data)) {
    opts.form = data;
  }
  this.request(opts, callback);
}

function write(id, item, callback) {
  callback = callback || NOP;
  var url = this.http_endpoint() + id;
  var data = this.http_param();
  data.method = 'write';
  data.content = item;
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.request(opts, callback);
}

function erase(id, callback) {
  callback = callback || NOP;
  var url = this.http_endpoint() + id;
  var data = this.http_param();
  data.method = 'erase';
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, callback);
}

function exist(id, callback) {
  callback = callback || NOP;
  var url = this.http_endpoint() + id;
  var data = this.http_param();
  data.method = 'exist';
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
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'index';
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

function http_param() {
  var source = this.get('http_param') || {};
  var param = utils.clone(source);
  for (var key in param) {
    if ('function' == typeof param[key]) {
      param[key] = param[key](); // lazy evaluation
    }
  }
  return param;
}

function http_endpoint() {
  var url = this.get('endpoint');
  if (!url) {
    throw new Error('endpoint not defined');
  }
  return url.replace(/\/*$/, '/');
}

function request(opts, callback) {
  throw new Error('request() not implemented');
}

function NOP() {}