/*! pkey.js */

/** This mixin overrides read() and write() method to provide a primary key feature.
 * @class PkeyMixin
 * @mixin
 */

module.exports = function(primary_key) {
  return mixin;

  function mixin() {
    var _read = this.read || no_read;
    var _write = this.write || no_write;

    this.read = function(id, next) {
      var callback = next;
      var pkey = this._pkey;
      if (!pkey && pkey !== null) {
        pkey = this._pkey = this.get('primary_key') || primary_key || null;
      }
      if (pkey) {
        callback = after_read;
      }
      _read.call(this, id, callback);

      function after_read(err, item) {
        if (!err && 'object' == typeof item) {
          item[pkey] = id;
        }
        next(err, item);
      }
    };

    this.write = function(id, item, next) {
      var pkey = this._pkey;
      if (!pkey && pkey !== null) {
        pkey = this._pkey = this.get('primary_key') || primary_key || null;
      }
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