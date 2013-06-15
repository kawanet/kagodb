/*! file_base.js */

var fs = require('fs');

module.exports = function() {
  var mixin = {};
  mixin.read = read;
  mixin.write = write;
  mixin.erase = erase;
  mixin.exist = exist;
  mixin.index = index;
  mixin.escape = escape;
  mixin.unescape = unescape;
  mixin.file_folder = file_folder;
  mixin.file_suffix = file_suffix;
  return mixin;
};

function escape(id) {
  var folder = this.file_folder();
  var suffix = this.file_suffix();
  return folder + '/' + encodeURIComponent(id) + suffix;
}

function unescape(id) {
  id = id.replace(/^.*\//, '');
  var suffix = this.file_suffix();
  var suftest = id.substr(-suffix.length);
  if (suffix.toLowerCase() == suftest.toLowerCase()) {
    id = id.substr(0, id.length - suffix.length);
    id = decodeURIComponent(id);
    return id;
  }
  return new Error('Invalid ID: ' + id);
}

function file_folder() {
  var path = this.get('path');
  if (!path) {
    throw new Error('"path" parameter for storage is not defined');
  }
  return path;
}

function file_suffix() {
  var suffix = this.get('suffix');
  if (!suffix) {
    throw new Error('"suffix" parameter for storage is not defined');
  }
  return suffix;
}

function read(id, callback) {
  var path = this.escape(id);
  var self = this;
  callback = callback || NOP;
  fs.readFile(path, 'utf8', function(err, content) {
    if (err) {
      callback(err);
    } else {
      self.decode(content, function(err, item) {
        callback(err, item);
      });
    }
  });
}

function write(id, item, callback) {
  var path = this.escape(id);
  callback = callback || NOP;
  this.encode(item, function(err, encoded) {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path, encoded, 'utf8', function(err) {
        callback(err);
      });
    }
  });
}

function erase(id, callback) {
  var path = this.escape(id);
  callback = callback || NOP;
  fs.unlink(path, function(err) {
    callback(err);
  });
}

function exist(id, callback) {
  var path = this.escape(id);
  callback = callback || NOP;
  fs.stat(path, function(err, stat) {
    callback(null, !! stat);
  });
}

function index(callback) {
  var folder = this.file_folder();
  var unescape = this.unescape.bind(this);
  callback = callback || NOP;
  fs.readdir(folder, function(err, list) {
    if (err) {
      callback(err);
    } else {
      list = list.map(unescape);
      list = list.filter(function(id) {
        return !(id instanceof Error);
      });
      callback(null, list);
    }
  });
}

function NOP() {}