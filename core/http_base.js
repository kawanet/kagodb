/*! http_base.js */

var encode = require('./encode');

module.exports = function() {
  var mixin = encode.call(this);
  mixin.read = read;
  mixin.write = write;
  mixin.erase = erase;
  mixin.exist = exist;
  mixin.index = index;
  mixin.request = request;
  mixin.endpoint = endpoint;
  return mixin;
};

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

function endpoint() {
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
