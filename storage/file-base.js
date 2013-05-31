/*! storage/file-base.js */

var fs = require('fs');

module.exports = StorageFile;

function StorageFile(options) {
  this.options = options || {};
}

StorageFile.prototype.folder = function() {
  var path = this.options.path;
  if (!path) {
    throw new Error('"path" parameter for storage is not defined');
  }
  return path;
};

StorageFile.prototype.suffix = function() {
  var suffix = this.options.suffix;
  if (!suffix) {
    throw new Error('"suffix" parameter for storage is not defined');
  }
  return suffix;
};

StorageFile.prototype.decode = function(source, callback) {
  throw new Error('decode() not implemented');
};

StorageFile.prototype.encode = function(item, callback) {
  throw new Error('encode() not implemented');
};

StorageFile.prototype.path = function(id) {
  var folder = this.folder();
  var suffix = this.suffix();
  return folder + '/' + id + suffix;
};

StorageFile.prototype.read = function(id, callback) {
  callback = callback || NOP;
  var path = this.path(id);
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
};

StorageFile.prototype.write = function(id, item, callback) {
  var path = this.path(id);
  this.encode(item, function(err, encoded) {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path, encoded, 'utf8', function(err) {
        callback(err);
      });
    }
  });
};

StorageFile.prototype.remove = function(id, callback) {
  var path = this.path(id);
  fs.unlink(path, function(err) {
    callback(err);
  });
};

StorageFile.prototype.exists = function(id, callback) {
  var path = this.path(id);
  fs.stat(path, function(err, stat) {
    callback(null, !! stat);
  });
};

StorageFile.prototype.keys = function(callback) {
  callback = callback || NOP;
  var folder = this.folder();
  var suffix = this.suffix();
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
      callback(null, list);
    }
  });
};

function NOP() {}