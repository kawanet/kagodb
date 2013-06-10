/*! pkey.js */

/** This mixin provides pkey() method in addition to overriding read() and write() method to install a primary key feature.
 * @class PkeyMixin
 * @mixin
 */

module.exports = function(default_pkey) {
  return mixin;

  function mixin() {
    var _read = this.read || no_read;
    var _write = this.write || no_write;

    /** This gets or sets a primary key. Use this interface to change a primary key after a session started.
     * @method PkeyMixin.prototype.pkey
     * @param {String} pkey - primary key to set
     * @returns {String} primary key
     * @example
     * var KagoDB = require('KagoDB');
     * var collection = new KagoDB();
     * collection.pkey('_id'); // => '_id'
     * collection.pkey(); // => '_id'
     * collection.get('primary_key'); // => '_id'
     */

    this.pkey = function(pkey) {
      if (arguments.length == 1) {
        this._pkey = pkey;
        this.set('primary_key', pkey);
        return pkey;
      }
      pkey = this._pkey;
      if (!pkey && pkey !== null) {
        pkey = this._pkey = this.get('primary_key') || default_pkey || null;
      }
      return pkey;
    };

    this.read = function(id, next) {
      var pkey = this.pkey();
      var callback = pkey ? after_read : next;
      _read.call(this, id, callback);

      function after_read(err, item) {
        if (!err && 'object' == typeof item) {
          item[pkey] = id;
        }
        next(err, item);
      }
    };

    this.write = function(id, item, next) {
      var pkey = this.pkey();
      if (pkey && 'object' == typeof item) {
        item[pkey] = id;
      }
      _write.call(this, id, item, next);
    };
  }
};

function no_read(id, callback) {
  throw new Error('method not implemented: read');
}

function no_write(id, item, callback) {
  throw new Error('method not implemented: write');
}