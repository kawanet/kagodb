/*! storage/yaml.js */

var jsyaml = require('js-yaml');
var utils = require('../core/utils')
var StorageFile = require('./file-base')

module.exports = utils.extend(StorageFile, StorageYAML);

function StorageYAML(options) {
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
