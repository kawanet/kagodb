/*! http-base.js */

module.exports = ProxyBase;

function ProxyBase(options) {
  if (!(this instanceof ProxyBase)) return new ProxyBase(options);
  this.options = options || {};
}

ProxyBase.prototype.read = read;
ProxyBase.prototype.write = write;
ProxyBase.prototype.erase = erase;
ProxyBase.prototype.exist = exist;
ProxyBase.prototype.index = index;

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

ProxyBase.prototype.endpoint = function() {
  var endpoint = this.options.endpoint;
  if (!endpoint) {
    throw new Error('endpoint not defined');
  }
  return endpoint.replace(/\/*$/, '/');
}

ProxyBase.prototype.request = function(opts, callback) {
  throw new Error('request() not implemented');
};

function NOP() {}