/*! storage/file-base.js */

var fs = require('fs');

module.exports = StorageFile;

function StorageFile() {}

StorageFile.prototype.folder = function(path) {
  throw new Error('folder() not implemented');
};
StorageFile.prototype.suffix = function(ext) {
  throw new Error('suffix() not implemented');
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
  if ('undefined' === typeof folder) {
    throw new Error('storage folder not defined');
  }
  if ('undefined' === typeof suffix) {
    throw new Error('storage file suffix not defined');
  }
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
      self.decode(content, callback);
    }
  });
};

StorageFile.prototype.write = function(id, item, callback) {
  var path = this.path(id);
  this.encode(item, function(err, encoded) {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path, encoded, 'utf8', callback);
    }
  });
};

StorageFile.prototype.remove = function(id, callback) {
  var path = this.path(id);
  fs.unlink(path, callback);
};

StorageFile.prototype.exists = function(id, callback) {
  var file = this.path(id);
  fs.stat(file, function(err, stat) {
    callback(null, !! stat);
  });
};

StorageFile.prototype.keys = function(callback) {
  callback = callback || NOP;
  var folder = this.folder();
  var suffix = this.suffix();
  if ('undefined' === typeof folder) {
    throw new Error('storage folder not defined');
  }
  if ('undefined' === typeof suffix) {
    throw new Error('storage file suffix not defined');
  }
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