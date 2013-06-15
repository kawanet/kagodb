/*! webapi_methods.js */

/**
 * This mixin provides [webapi()]{@linkcode KagoDB#webapi} method which gives a RESTful Web API feature for {@link http://expressjs.com Express.js}.
 *
 * @class webapi
 * @mixin
 * @example
 */

module.exports = WebapiMethods;

var success = {
  success: true
};

function WebapiMethods() {}

WebapiMethods.prototype.read = function(req, res, next) {
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

WebapiMethods.prototype.write = function(req, res, next) {
  var collection = req.kagodb;
  var id = req.param('id');
  if (!id) return next(); // id must be specified

  parse_content(req, res, function(content) {
    collection.emit('webapi', 'write', id, content);
    collection.write(id, content, function(err) {
      if (err) collection.emit('warn', 'write failed:', err);
      res.send(err ? 500 : success);
    });
  });
};

WebapiMethods.prototype.erase = function(req, res, next) {
  var collection = req.kagodb;
  var id = req.param('id');
  if (!id) return next(); // id must be specified

  collection.emit('webapi', 'erase', id);
  collection.erase(id, function(err) {
    if (err) collection.emit('warn', 'erase failed:', err);
    res.send(err ? 500 : success);
  });
};

WebapiMethods.prototype.exist = function(req, res, next) {
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

WebapiMethods.prototype.index = function(req, res, next) {
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

WebapiMethods.prototype.find = function(req, res, next) {
  var collection = req.kagodb;
  var offset = req.param('offset');
  var limit = req.param('limit');
  var cursor;

  parse_condition(req, res, function(condition) {
    parse_projection(req, res, function(projection) {
      parse_options(req, res, function(options) {
        parse_sort(req, res, function(sort) {
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
      });
    });
  });
};

WebapiMethods.prototype.findOne = function(req, res, next) {
  var collection = req.kagodb;

  parse_condition(req, res, function(condition) {
    parse_options(req, res, function(options) {
      collection.findOne(condition, options, function(err, item) {
        if (err) collection.emit('warn', 'findOne failed:', err);
        res.send(err ? 500 : item);
      });
    });
  });
};

WebapiMethods.prototype.count = function(req, res, next) {
  var collection = req.kagodb;

  parse_condition(req, res, function(condition) {
    parse_options(req, res, function(options) {
      collection.emit('webapi', 'count', condition);
      collection.count(condition, options, function(err, count) {
        if (err) collection.emit('warn', 'count failed:', err);
        var success = {
          count: count
        };
        res.send(err ? 500 : success);
      });
    });
  });
};

WebapiMethods.prototype.insert = function(req, res, next) {
  var collection = req.kagodb;

  parse_content(req, res, function(content) {
    collection.emit('webapi', 'insert', content);
    collection.insert(content, function(err) {
      if (err) collection.emit('warn', 'insert failed:', err);
      res.send(err ? 500 : success);
    });
  });
};

WebapiMethods.prototype.save = function(req, res, next) {
  var collection = req.kagodb;

  parse_content(req, res, function(content) {
    collection.emit('webapi', 'save', content);
    collection.save(content, function(err) {
      if (err) collection.emit('warn', 'save failed:', err);
      res.send(err ? 500 : success);
    });
  });
};

WebapiMethods.prototype.update = function(req, res, next) {
  var collection = req.kagodb;

  parse_condition(req, res, function(condition) {
    parse_update(req, res, function(update) {
      parse_options(req, res, function(options) {
        collection.emit('webapi', 'update', condition, update, options);
        collection.update(condition, update, options, function(err) {
          if (err) collection.emit('warn', 'update failed:', err);
          res.send(err ? 500 : success);
        });
      });
    });
  });
};

WebapiMethods.prototype.findAndModify = function(req, res, next) {
  var collection = req.kagodb;

  parse_condition(req, res, function(condition) {
    parse_sort(req, res, function(sort) {
      parse_update(req, res, function(update) {
        parse_options(req, res, function(options) {
          collection.emit('webapi', 'findAndModify', condition, sort, update, options);
          collection.findAndModify(condition, sort, update, options, function(err) {
            if (err) collection.emit('warn', 'findAndModify failed:', err);
            res.send(err ? 500 : success);
          });
        });
      });
    });
  });
};

WebapiMethods.prototype.remove = function(req, res, next) {
  var collection = req.kagodb;

  parse_condition(req, res, function(condition) {
    parse_options(req, res, function(options) {
      collection.emit('webapi', 'remove', condition, options);
      collection.remove(condition, options, function(err) {
        if (err) collection.emit('warn', 'remove failed:', err);
        res.send(err ? 500 : success);
      });
    });
  });
};

function parse_sort(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var sort = req.param('sort');

  // translate query parameters
  sort = kagoapi.parse(sort);

  // validate parameters
  if (sort instanceof Error) {
    collection.emit('warn', 'parse_sort failed:', sort);
    return res.send(400); // Bad Request
  }

  next(sort);
}

function parse_update(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var update = req.param('update');

  // translate query parameters
  update = kagoapi.parse(update);

  // validate parameters
  if (update instanceof Error) {
    collection.emit('warn', 'parse_update failed:', update);
    return res.send(400); // Bad Request
  }

  next(update);
}

function parse_projection(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var projection = req.param('projection');

  // translate query parameters
  projection = kagoapi.parse(projection);

  // validate parameters
  if (projection instanceof Error) {
    collection.emit('warn', 'parse_projection failed:', projection);
    return res.send(400); // Bad Request
  }

  next(projection);
}

function parse_options(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var options = req.param('options');

  // translate query parameters
  options = kagoapi.parse(options);

  // validate parameters
  if (options instanceof Error) {
    collection.emit('warn', 'parse_options failed:', options);
    return res.send(400); // Bad Request
  }

  next(options);
}

function parse_condition(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var condition = req.param('condition');

  // translate query parameters
  condition = kagoapi.parse(condition);

  // validate parameters
  if (condition instanceof Error) {
    collection.emit('warn', 'parse_condition failed:', condition);
    return res.send(400); // Bad Request
  }

  next(condition);
}

function parse_content(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var content = req.param('content');

  // content refers body when PUT
  if (!content && req.method.toLowerCase() == 'put') {
    content = req.body;
  }

  // translate query parameters
  content = kagoapi.parse(content);

  // validate parameter
  if (!content || 'object' !== typeof content) {
    collection.emit('warn', 'parse_content failed: invalid content', content);
    return res.send(400); // Bad Request
  }
  if (content instanceof Error) {
    collection.emit('warn', 'parse_content failed:', content);
    return res.send(400); // Bad Request
  }
  if (!Object.keys(content).length) {
    collection.emit('warn', 'parse_content failed: empty content', content);
    return res.send(400); // Bad Request
  }

  next(content);
}