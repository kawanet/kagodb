/*! webmethods.js */

var BAD_REQUEST = 400;
var NOT_FOUND = 404;
var INTERNAL_SERVER_ERROR = 500;

/**
 * This mixin provides method handler functions for an express application.
 * Those handlers are invoked from
 * [webapi()]{@linkcode KagoDB#webapi} method.
 * You could add a new method and/or replace an existing methods via
 * [webmethods()]{@linkcode KagoDB#webmethods}
 *  interface.
 *
 * @class WebMethods
 * @example
 *
 * var _wm = MyKago.prototype.webmethods;
 * MyKago.prototype.webmethods = function() {
 *     var wm = _wm.apply(this, arguments);
 *
 *     // add a new method
 *     wm.mymethod = function(req, res, next) {
 *         var collection = req.kagodb;
 *         var webapi = req.webapi;
 *         // do some thing
 *     };
 *
 *     // override an existing method
 *     var _read = wm.read;
 *     wm.read = function(req, res, next) {
 *         var collection = req.kagodb;
 *         var webapi = req.webapi;
 *         // do some thing before read
 *         _read.call(this, req, res, function() {
 *             // do some thing after read
 *             next();
 *         });
 *     };
 *
 *     return wm;
 * };
 */

module.exports = WebMethods;

var success = {
  success: true
};

function WebMethods() {}

/**
 * This is a bridge function to
 * [read()]{@linkcode KagoDB#read}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.read = function(req, res, next) {
  var collection = req.kagodb;
  var id = req.param('id');
  if (!id) return next(); // id must be specified

  collection.emit('webapi', 'read', id);
  collection.exist(id, function(err, exist) {
    if (err) collection.emit('warn', 'exist failed:', err);
    if (err) return res.status(INTERNAL_SERVER_ERROR).end();
    if (!exist) return res.status(NOT_FOUND).end();
    collection.read(id, function(err, item) {
      if (err) collection.emit('warn', 'read failed:', err);
      if (err) return res.status(INTERNAL_SERVER_ERROR).end();
      res.send(item);
    });
  });
};

/**
 * This is a bridge function to
 * [write()]{@linkcode KagoDB#write}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.write = function(req, res, next) {
  if (!req.param('content') && req.method.toLowerCase() == 'put') {
    // content refers body when PUT
    req.params.content = req.body;
  }

  parse_params('content')(req, res, function() {
    var collection = req.kagodb;
    var id = req.param('id');
    var content = req.param('content');
    if (!id) return next(); // id must be specified

    // validate parameter
    if (!content || 'object' !== typeof content) {
      collection.emit('warn', 'parse_content failed: invalid content', content);
      return res.status(BAD_REQUEST).end();
    }
    if (!Object.keys(content).length) {
      collection.emit('warn', 'parse_content failed: empty content', content);
      return res.status(BAD_REQUEST).end();
    }

    collection.emit('webapi', 'write', id, content);
    collection.write(id, content, function(err) {
      if (err) collection.emit('warn', 'write failed:', err);
      if (err) return res.status(INTERNAL_SERVER_ERROR).end();
      res.send(success);
    });
  });
};

/**
 * This is a bridge function to
 * [erase()]{@linkcode KagoDB#erase}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.erase = function(req, res, next) {
  var collection = req.kagodb;
  var id = req.param('id');
  if (!id) return next(); // id must be specified

  collection.emit('webapi', 'erase', id);
  collection.erase(id, function(err) {
    if (err) collection.emit('warn', 'erase failed:', err);
    if (err) return res.status(INTERNAL_SERVER_ERROR).end();
    res.send(success);
  });
};

/**
 * This is a bridge function to
 * [exist()]{@linkcode KagoDB#exist}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.exist = function(req, res, next) {
  var collection = req.kagodb;
  var id = req.param('id');
  if (!id) return next(); // id must be specified

  collection.emit('webapi', 'exist', id);
  collection.exist(id, function(err, exist) {
    if (err) collection.emit('warn', 'exist failed:', err);
    var success = {
      exist: !! exist
    };
    if (err) return res.status(INTERNAL_SERVER_ERROR).end();
    res.send(success);
  });
};

/**
 * This is a bridge function to
 * [index()]{@linkcode KagoDB#index}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.index = function(req, res, next) {
  var collection = req.kagodb;

  collection.emit('webapi', 'index:');
  collection.index(function(err, list) {
    if (err) collection.emit('warn', 'index failed:', err);
    var success = {
      index: list
    };
    if (err) return res.status(INTERNAL_SERVER_ERROR).end();
    res.send(success);
  });
};

/**
 * This is a bridge function to
 * [find()]{@linkcode KagoDB#find}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.find = function(req, res, next) {
  parse_params('condition', 'projection', 'options', 'sort')(req, res, function() {
    var collection = req.kagodb;
    var condition = req.param('condition');
    var projection = req.param('projection');
    var options = req.param('options');
    var sort = req.param('sort');
    var offset = req.param('offset') - 0 || req.param('skip') - 0;
    var limit = req.param('limit') - 0;
    var cursor;

    collection.emit('webapi', 'find', condition, projection, options);
    cursor = collection.find(condition, projection, options);
    if (sort) cursor.sort(sort);
    if (offset) cursor.offset(offset);
    if (limit) cursor.limit(limit);
    cursor.toArray(function(err, list) {
      if (err) collection.emit('warn', 'find failed:', err);
      var success = {
        data: list
      };
      if (err) return res.status(INTERNAL_SERVER_ERROR).end();
      res.send(success);
    });
  });
};

/**
 * This is a bridge function to
 * [findOne()]{@linkcode KagoDB#findOne}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.findOne = function(req, res, next) {
  parse_params('condition', 'options')(req, res, function() {
    var collection = req.kagodb;
    var condition = req.param('condition');
    var options = req.param('options');

    collection.emit('webapi', 'findOne', condition, options);
    collection.findOne(condition, options, function(err, item) {
      if (err) collection.emit('warn', 'findOne failed:', err);
      if (err) return res.status(INTERNAL_SERVER_ERROR).end();
      res.send(item);
    });
  });
};

/**
 * This is a bridge function to
 * [count()]{@linkcode KagoDB#count}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.count = function(req, res, next) {
  parse_params('condition', 'options')(req, res, function() {
    var collection = req.kagodb;
    var condition = req.param('condition');
    var options = req.param('options');

    collection.emit('webapi', 'count', condition, options);
    collection.count(condition, options, function(err, count) {
      if (err) collection.emit('warn', 'count failed:', err);
      var success = {
        count: count
      };
      if (err) return res.status(INTERNAL_SERVER_ERROR).end();
      res.send(success);
    });
  });
};

/**
 * This is a bridge function to
 * [insert()]{@linkcode KagoDB#insert}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.insert = function(req, res, next) {
  parse_params('content')(req, res, function() {
    var collection = req.kagodb;
    var content = req.param('content');

    collection.emit('webapi', 'insert', content);
    collection.insert(content, function(err) {
      if (err) collection.emit('warn', 'insert failed:', err);
      if (err) return res.status(INTERNAL_SERVER_ERROR).end();
      res.send(success);
    });
  });
};

/**
 * This is a bridge function to
 * [save()]{@linkcode KagoDB#save}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.save = function(req, res, next) {
  parse_params('content')(req, res, function() {
    var collection = req.kagodb;
    var content = req.param('content');

    collection.emit('webapi', 'save', content);
    collection.save(content, function(err) {
      if (err) collection.emit('warn', 'save failed:', err);
      if (err) return res.status(INTERNAL_SERVER_ERROR).end();
      res.send(success);
    });
  });
};

/**
 * This is a bridge function to
 * [update()]{@linkcode KagoDB#update}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.update = function(req, res, next) {
  parse_params('condition', 'update', 'options')(req, res, function() {
    var collection = req.kagodb;
    var condition = req.param('condition');
    var update = req.param('update');
    var options = req.param('options');

    collection.emit('webapi', 'update', condition, update, options);
    collection.update(condition, update, options, function(err) {
      if (err) collection.emit('warn', 'update failed:', err);
      if (err) return res.status(INTERNAL_SERVER_ERROR).end();
      res.send(success);
    });
  });
};

/**
 * This is a bridge function to
 * [findAndModify()]{@linkcode KagoDB#findAndModify}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.findAndModify = function(req, res, next) {
  parse_params('condition', 'sort', 'update', 'options')(req, res, function() {
    var collection = req.kagodb;
    var condition = req.param('condition');
    var sort = req.param('sort');
    var update = req.param('update');
    var options = req.param('options');

    collection.emit('webapi', 'findAndModify', condition, sort, update, options);
    collection.findAndModify(condition, sort, update, options, function(err) {
      if (err) collection.emit('warn', 'findAndModify failed:', err);
      if (err) return res.status(INTERNAL_SERVER_ERROR).end();
      res.send(success);
    });
  });
};

/**
 * This is a bridge function to
 * [remove()]{@linkcode KagoDB#remove}
 * method from express webapi app.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next function
 */

WebMethods.prototype.remove = function(req, res, next) {
  parse_params('condition', 'options')(req, res, function() {
    var collection = req.kagodb;
    var condition = req.param('condition');
    var options = req.param('options');

    collection.emit('webapi', 'remove', condition, options);
    collection.remove(condition, options, function(err) {
      if (err) collection.emit('warn', 'remove failed:', err);
      if (err) return res.status(INTERNAL_SERVER_ERROR).end();
      res.send(success);
    });
  });
};

/**
 * @ignore
 */

function parse_params() {
  var keys = [].concat(arguments);
  return function(req, res, next) {
    var collection = req.kagodb;
    var kagoapi = req.kagoapi;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = req.param(key);
      var parsed = kagoapi.parse(value);
      if (value instanceof Error) {
        collection.emit('warn', 'invalid parameter: ' + key + '=' + value);
        return res.status(BAD_REQUEST).end();
      }
      req.params = req.params || {};
      req.params[key] = parsed;
    }
    next();
  };
}
