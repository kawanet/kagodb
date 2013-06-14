/*! http_base.js */

var utils = require('../core/utils');
var http_more = require('../storage/http_more');

module.exports = function() {
  var mixin = {};

  // basic storage IO
  mixin.read = read;
  mixin.write = write;
  mixin.erase = erase;
  mixin.exist = exist;
  mixin.index = index;

  // basic HTTP
  mixin.request = request;
  mixin.http_endpoint = http_endpoint;
  mixin.http_param = http_param;

  // import more methods
  utils.extend(mixin, http_more.call(this));

  return mixin;
};

function read(id, callback) {
  var url = this.http_endpoint() + id;
  var data = this.http_param();
  var opts = {
    method: 'GET',
    url: url,
  };
  if (Object.keys(data)) {
    opts.form = data;
  }
  this.request(opts, response_parser(null, callback));
}

function write(id, item, callback) {
  var url = this.http_endpoint() + id;
  var data = this.http_param();
  data.method = 'write';
  data.content = item;
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.request(opts, response_parser('success', callback));
}

function erase(id, callback) {
  var url = this.http_endpoint() + id;
  var data = this.http_param();
  data.method = 'erase';
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, response_parser('success', callback));
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
  this.request(opts, response_parser('exist', callback));
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
  this.request(opts, response_parser('index', callback));
}

function response_parser(column, callback) {
  if (!callback) return;
  return function(err, res) {
    if (err) {
      callback(err);
    } else if (!column) {
      callback(null, res);
    } else if ('object' != typeof res) {
      callback();
    } else {
      callback(null, res[column]);
    }
  };
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