/*! storage/yaml.js */

var fs = require('fs');
var jsyaml = require('js-yaml');

module.exports = StorageYAML;

function StorageYAML(options) {
  if (!(this instanceof StorageYAML)) return new StorageYAML(options);
  options = options || {};
  if (options.path) {
    this.folder(options.path);
  }
  if (options.suffix) {
    this.suffix(options.suffix);
  }
}

StorageYAML.prototype.folder = function(path) {
  return this._folder = path || this._folder;
};
StorageYAML.prototype.suffix = function(ext) {
  return this._suffix = ext || this._suffix || '.yaml';
};
StorageYAML.prototype.decode = function(source) {
  return jsyaml.load(source);
};
StorageYAML.prototype.encode = function(item) {
  return jsyaml.dump(item);
};

StorageYAML.prototype.path = function(id) {
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

StorageYAML.prototype.read = function(id, callback) {
  callback = callback || NOP;
  var path = this.path(id);
  var self = this;
  fs.readFile(path, 'utf8', function(err, content) {
    if (err) {
      callback(err);
    } else {
      var item = self.decode(content);
      callback(null, item);
    }
  });
};

StorageYAML.prototype.write = function(id, item, callback) {
  var path = this.path(id);
  var encoded = this.encode(item);
  fs.writeFile(path, encoded, 'utf8', callback);
};

StorageYAML.prototype.remove = function(id, callback) {
  var path = this.path(id);
  fs.unlink(path, callback);
};

StorageYAML.prototype.exists = function(id, callback) {
  var file = this.path(id);
  fs.stat(file, function(err, stat) {
    callback(null, !! stat);
  });
};

StorageYAML.prototype.keys = function(callback) {
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