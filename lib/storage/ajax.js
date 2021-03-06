/*! ajax.js */

/**
 * This mixin implements a virtual
 * [storage]{@linkcode storage}
 * feature which performs Ajax requests to a remote KagoDB
 * [webapi]{@linkcode KagoDB#webapi} server.
 *
 * This requires one of supported ajax drivers:
 * "ajax", "jquery" and "superagent".
 *
 * Default driver is
 * [request]{@link https://npmjs.org/package/request}
 * module on node.js, and
 * [jQuery]{@link http://jquery.com}
 * library on web browser environments.
 *
 * @class ajax
 * @mixin
 * @example
 * var opts = {
 *   storage: 'ajax', // storage engine
 *   ajax: 'jquery', // ajax driver
 *   endpoint: 'http://localhost:3000/data/'
 * };
 *
 * var collection = new KagoDB(opts);
 *
 * collection.read('foo', function(err, item){
 *   // http://localhost:3000/data/foo
 * });
 */

var utils = require('../core/utils');
var http_more = require('../mixin/http_more');

module.exports = function() {
  var mixin = {};

  // basic storage IO
  mixin.read = read;
  mixin.write = write;
  mixin.erase = erase;
  mixin.exist = exist;
  mixin.index = index;

  // basic HTTP
  mixin.http_endpoint = http_endpoint;
  mixin.http_param = param_func('http_param', true);

  // import more methods
  utils.extend(mixin, http_more.call(this));

  return mixin;
};

function read(id, callback) {
  callback = callback || NOP;
  var self = this;
  var url = this.http_endpoint() + id;
  var data = this.http_param();
  var opts = {
    method: 'GET',
    url: url,
  };
  if (Object.keys(data)) {
    opts.form = data;
  }
  this.ajax(opts, after_ajax);

  function after_ajax(err, item) {
    if (!err && self.unwrap) {
      item = self.unwrap(item);
    }
    callback(err, item);
  }
}

function write(id, item, callback) {
  var url = this.http_endpoint() + id;
  if (this.wrap) {
    item = this.wrap(item);
  }
  var data = this.http_param();
  data.method = 'write';
  data.content = item;
  var opts = {
    method: 'POST',
    url: url,
    json: data
  };
  this.ajax(opts, response_parser('success', callback));
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
  this.ajax(opts, response_parser('success', callback));
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
  this.ajax(opts, response_parser('exist', callback));
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
  this.ajax(opts, response_parser('index', callback));
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

function http_param(key, val) {
  var source = this.get('http_param') || {};
  if (arguments.length == 1) {
    return source[key];
  }
  var param = utils.clone(source);
  if (arguments.length > 1) {
    param[key] = val;
    this.set('http_param', param);
    return this;
  }
  for (key in param) {
    if ('function' == typeof param[key]) {
      param[key] = param[key](); // lazy evaluation
    }
  }
  return param;
}

// generates parameter manipulation function
function param_func(name, lazy) {
  return function(key, val) {
    var param = this.get(name) || {};
    if (arguments.length == 1) {
      return param[key];
    }
    param = utils.clone(param);
    if (arguments.length > 1) {
      param[key] = val;
      this.set(name, param);
      return this;
    }
    if (lazy) {
      for (key in param) {
        if ('function' == typeof param[key]) {
          param[key] = param[key](); // lazy evaluation
        }
      }
    }
    return param;
  };
}

function http_endpoint() {
  var url = this.get('endpoint');
  if (!url) {
    throw new Error('endpoint not defined');
  }
  return url.replace(/\/*$/, '/');
}

function NOP() {}
