/*! http_more.js */

var KagoDB = require('../core/base');

module.exports = function() {
  var mixin = {};

  // mixin.find = find;
  mixin.findOne = findOne;
  mixin.count = count;
  mixin.insert = insert;
  mixin.save = save;
  mixin.remove = remove;
  mixin.update = update;
  mixin.findAndModify = findAndModify;

  return mixin;
};

function findOne(condition, callback) {
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'findOne';
  data.condition = condition;
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, response_parser(null, callback));
}

function count(condition, callback) {
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'count';
  data.condition = condition;
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, response_parser('count', callback));
}

function insert(item, callback) {
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'insert';
  data.content = item;
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, response_parser('success', callback));
}

function save(item, callback) {
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'save';
  data.content = item;
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, response_parser('success', callback));
}

function remove(condition, justOne, callback) {
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'remove';
  data.condition = condition;
  data.options = {
    multi: (justOne ? 0 : 1)
  };
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, response_parser('success', callback));
}

function update(condition, _update, options, callback) {
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'update';
  data.condition = condition;
  data.update = _update;
  data.options = options;
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, response_parser('success', callback));
}

function findAndModify(condition, sort, update, options, callback) {
  var url = this.http_endpoint();
  var data = this.http_param();
  data.method = 'findAndModify';
  data.condition = condition;
  data.sort = sort;
  data.update = update;
  data.options = options;
  var opts = {
    method: 'POST',
    url: url,
    form: data
  };
  this.request(opts, response_parser('success', callback));
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
