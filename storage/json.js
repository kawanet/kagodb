/*! json.js */

/**
 * This mixin provides a file-based storage feature which stores items as JSON files.
 *
 * @class json
 * @mixin
 * @see http://www.ietf.org/rfc/rfc4627.txt
 * @example
 * var opts = {
 *   storage: 'json',
 *   path: __dirname + '/data'
 * };
 *
 * var collection = new KagoDB(opts);
 *
 * collection.read('foo', function(err, item){
 *   // ./data/foo.json
 * });
 */

var file_base = require('../core/file_base');

module.exports = function() {
  var mixin = file_base.call(this);
  mixin.file_suffix = file_suffix;
  return mixin;
};

function file_suffix() {
  return this.get('suffix') || '.json';
}