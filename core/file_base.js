/*! file_base.js */

var fs = require('fs');
var encode = require('./encode');

module.exports = function() {
  var mixin = encode.call(this);
  mixin.read = read;
  mixin.write = write;
  mixin.erase = erase;
  mixin.exist = exist;
  mixin.index = index;
  mixin.file_path = file_path;
  mixin.file_folder = file_folder;
  mixin.file_suffix = file_suffix;
  return mixin;
};

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

function file_path(id) {
  var folder = this.file_folder();
  var suffix = this.file_suffix();
  return folder + '/' + this.escape(id) + suffix;
}

function read(id, callback) {
  callback = callback || NOP;
  var path = this.file_path(id);
  var self = this;
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
  var path = this.file_path(id);
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
  var path = this.file_path(id);
  fs.unlink(path, function(err) {
    callback(err);
  });
}

function exist(id, callback) {
  var path = this.file_path(id);
  fs.stat(path, function(err, stat) {
    callback(null, !! stat);
  });
}

function index(callback) {
  var self = this;
  callback = callback || NOP;
  var folder = this.file_folder();
  var suffix = this.file_suffix();
  suffix = suffix.toLowerCase();
  var suflen = suffix.length;
  fs.readdir(folder, function(err, list) {
    if (err) {
      callback(err);
    } else {
      list = list.filter(function(file) {
        return (file.substr(-suflen).toLowerCase() == suffix);
      });
      list = list.map(function(file) {
        return file.substr(0, file.length - suflen);
      });
      list = list.map(function(file) {
        return self.unescape(file);
      });
      callback(null, list);
    }
  });
}

function NOP() {}