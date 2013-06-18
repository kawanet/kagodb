/*! webmethods.js */

/**
 * This mixin provides method handlers as an express application.
 *
 * @class webmethods
 * @mixin
 */

module.exports = WebMethods;

var success = {
  success: true
};

function WebMethods() {}

WebMethods.prototype.read = function(req, res, next) {
  var collection = req.kagodb;
  var id = req.param('id');
  if (!id) return next(); // id must be specified

  collection.emit('webapi', 'read', id);
  collection.exist(id, function(err, exist) {
    if (err) collection.emit('warn', 'exist failed:', err);
    if (err) return res.send(500); // Internal Server Error
    if (!exist) return res.send(404); // Not Found
    collection.read(id, function(err, item) {
      if (err) collection.emit('warn', 'read failed:', err);
      res.send(err ? 500 : item);
    });
  });
};

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
      return res.send(400); // Bad Request
    }
    if (!Object.keys(content).length) {
      collection.emit('warn', 'parse_content failed: empty content', content);
      return res.send(400); // Bad Request
    }

    collection.emit('webapi', 'write', id, content);
    collection.write(id, content, function(err) {
      if (err) collection.emit('warn', 'write failed:', err);
      res.send(err ? 500 : success);
    });
  });
};

WebMethods.prototype.erase = function(req, res, next) {
  var collection = req.kagodb;
  var id = req.param('id');
  if (!id) return next(); // id must be specified

  collection.emit('webapi', 'erase', id);
  collection.erase(id, function(err) {
    if (err) collection.emit('warn', 'erase failed:', err);
    res.send(err ? 500 : success);
  });
};

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
    res.send(err ? 500 : success);
  });
};

WebMethods.prototype.index = function(req, res, next) {
  var collection = req.kagodb;

  collection.emit('webapi', 'index:');
  collection.index(function(err, list) {
    if (err) collection.emit('warn', 'index failed:', err);
    var success = {
      index: list
    };
    res.send(err ? 500 : success);
  });
};

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
      res.send(err ? 500 : success);
    });
  });
};

WebMethods.prototype.findOne = function(req, res, next) {
  parse_params('condition', 'options')(req, res, function() {
    var collection = req.kagodb;
    var condition = req.param('condition');
    var options = req.param('options');

    collection.emit('webapi', 'findOne', condition, options);
    collection.findOne(condition, options, function(err, item) {
      if (err) collection.emit('warn', 'findOne failed:', err);
      res.send(err ? 500 : item);
    });
  });
};

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
      res.send(err ? 500 : success);
    });
  });
};

WebMethods.prototype.insert = function(req, res, next) {
  parse_params('content')(req, res, function() {
    var collection = req.kagodb;
    var content = req.param('content');

    collection.emit('webapi', 'insert', content);
    collection.insert(content, function(err) {
      if (err) collection.emit('warn', 'insert failed:', err);
      res.send(err ? 500 : success);
    });
  });
};

WebMethods.prototype.save = function(req, res, next) {
  parse_params('content')(req, res, function() {
    var collection = req.kagodb;
    var content = req.param('content');

    collection.emit('webapi', 'save', content);
    collection.save(content, function(err) {
      if (err) collection.emit('warn', 'save failed:', err);
      res.send(err ? 500 : success);
    });
  });
};

WebMethods.prototype.update = function(req, res, next) {
  parse_params('condition', 'update', 'options')(req, res, function() {
    var collection = req.kagodb;
    var condition = req.param('condition');
    var update = req.param('update');
    var options = req.param('options');

    collection.emit('webapi', 'update', condition, update, options);
    collection.update(condition, update, options, function(err) {
      if (err) collection.emit('warn', 'update failed:', err);
      res.send(err ? 500 : success);
    });
  });
};

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
      res.send(err ? 500 : success);
    });
  });
};

WebMethods.prototype.remove = function(req, res, next) {
  parse_params('condition', 'options')(req, res, function() {
    var collection = req.kagodb;
    var condition = req.param('condition');
    var options = req.param('options');

    collection.emit('webapi', 'remove', condition, options);
    collection.remove(condition, options, function(err) {
      if (err) collection.emit('warn', 'remove failed:', err);
      res.send(err ? 500 : success);
    });
  });
};

function parse_params() {
  var keys = [].concat(arguments);
  return function(req, res, next) {
    var kagoapi = req.kagoapi;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = req.param(key);
      var parsed = kagoapi.parse(value);
      if (value instanceof Error) {
        collection.emit('warn', 'invalid parameter: ' + key + '=' + value);
        return res.send(400); // Bad Request
      }
      req.params = req.params || {};
      req.params[key] = parsed;
    }
    next();
  };
}
