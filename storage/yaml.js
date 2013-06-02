/*! yaml.js */

var jsyaml = require('js-yaml');
var utils = require('../core/utils');
var StorageFile = require('./file-base');

module.exports = utils.inherits(StorageYAML, StorageFile);

function StorageYAML(options) {
  if (!(this instanceof StorageYAML)) return new StorageYAML(options);
  if (this.__super__) this.__super__.apply(this, arguments); // super class's constructor
  this.options.suffix = this.options.suffix || '.yaml';
}

StorageYAML.prototype.decode = function(source, callback) {
  var item;
  try {
    item = jsyaml.load(source);
  } catch (err) {
    callback(err);
    return;
  }
  callback(null, item);
};

StorageYAML.prototype.encode = function(item, callback) {
  var encoded;
  try {
    encoded = jsyaml.dump(item);
  } catch (err) {
    callback(err);
  }
  callback(null, encoded);
};
