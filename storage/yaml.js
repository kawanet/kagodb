/*! storage/yaml.js */

var fs = require('fs');
var jsyaml = require('js-yaml');

module.exports = StorageYAML;

function StorageYAML(options) {
  if (!(this instanceof StorageYAML)) return new StorageYAML(options);
  options = options || {};
  this.folder(options.path);
}

StorageYAML.prototype.path = path;
StorageYAML.prototype.folder = folder;
StorageYAML.prototype.read = read;
StorageYAML.prototype.write = write;
StorageYAML.prototype.remove = remove;
StorageYAML.prototype.exists = exists;
StorageYAML.prototype.keys = keys;

function path(id) {
  var folder = this.folder();
  return folder + '/' + id + '.yaml';
}

function folder(path) {
  return this._folder = path || this._folder || 'data';
}

function read(id, callback) {
  callback = callback || NOP;
  var path = this.path(id);
  fs.readFile(path, 'utf8', function(err, content) {
    if (err) {
      callback(err);
    } else {
      var item = jsyaml.load(content);
      callback(null, item);
    }
  });
}

function write(id, item, callback) {
  var path = this.path(id);
  var yaml = jsyaml.dump(item);
  fs.writeFile(path, yaml, 'utf8', callback);
}

function remove(id, callback) {
  var path = this.path(id);
  fs.unlink(path, callback);
}

function exists(id, callback) {
  var file = this.path(id);
  fs.stat(file, function(err, stat) {
    callback(null, !! stat);
  });
}

function keys(callback) {
  callback = callback || NOP;
  var folder = this.folder();
  fs.readdir(folder, function(err, list) {
    if (err) {
      callback(err);
    } else {
      list = list.filter(function(file) {
        return (file.search(/\.yaml$/i) > -1);
      });
      list = list.map(function(file) {
        return file.replace(/\.yaml$/i, '');
      });
      callback(null, list);
    }
  });
}

function NOP() {}