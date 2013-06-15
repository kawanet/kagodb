/*! init.js */

/**
 * This mixin provides
 * [init()]{@linkcode KagoDB#init}
 * method which may initialize something depending on storage engines or ajax drivers, etc.
 *
 * @class init
 * @mixin
 * @example
 * var collection = new KagoDB({storage: 'json'});
 *
 * collection.init(); // initialize
 */

/**
 * This may initialize something. This method may be called automatically.
 * This is a hook point at start-up.
 * It means that you could override this method when you do initialize something with your class.
 *
 * @method KagoDB.prototype.init
 * @returns {KagoDB} itself for method chaining
 * @example
 * var opts = {storage: 'json', path: './data'};
 * var collection = new KagoDB(opts);
 * collection.init(); // may do something
 * collection.write('foo', item);
 */

module.exports = function() {
  return {
    init: function() {
      return this;
    }
  };
};