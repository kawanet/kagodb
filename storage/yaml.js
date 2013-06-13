/*! yaml.js */

/**
 * This mixin provides a file-based storage feature which stores items as YAML files.
 *
 * @class yaml
 * @mixin
 * @see https://npmjs.org/package/js-yaml
 * @example
 * var opts = {
 *   storage: 'yaml',
 *   path: __dirname + '/data'
 * };
 *
 * var collection = new KagoDB(opts);
 *
 * collection.read('foo', function(err, item){
 *   // ./data/foo.yaml
 * });
 */

var jsyaml = require('js-yaml');
var file_base = require('../core/file_base');

module.exports = function() {
  var mixin = file_base.call(this);
  mixin.file_suffix = file_suffix;
  mixin.decode = decode;
  mixin.encode = encode;
  return mixin;
};

function file_suffix() {
  return this.get('suffix') || '.yaml';
}

function decode(source, callback) {
  var item;
  try {
    item = jsyaml.load(source);
  } catch (err) {
    callback(err);
    return;
  }
  callback(null, item);
}

function encode(item, callback) {
  var encoded;
  try {
    encoded = jsyaml.dump(item);
  } catch (err) {
    callback(err);
  }
  callback(null, encoded);
}
