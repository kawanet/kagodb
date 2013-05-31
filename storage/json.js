/*! storage/json.js */

var utils = require('../core/utils')
var StorageFile = require('./file-base')

module.exports = utils.inherits(StorageJSON, StorageFile);

function StorageJSON(options) {
  this.__super__ = this.__super__ || NOP;
  this.__super__.apply(this, arguments); // super class's constructor
  this.options = this.options || {};
  this.options.suffix = this.options.suffix || '.json';
}

StorageJSON.prototype.decode = function(source, callback) {
  var item;
  try {
    item = JSON.parse(source);
  } catch (err) {
    callback(err);
    return;
  }
  callback(null, item);
};

StorageJSON.prototype.encode = function(item, callback) {
  var encoded;
  var replacer = this.options['json-replacer'];
  var spaces = this.options['json-spaces'];
  try {
    encoded = JSON.stringify(item, replacer, spaces);
  } catch (err) {
    callback(err);
  }
  callback(null, encoded);
};

function NOP() {}