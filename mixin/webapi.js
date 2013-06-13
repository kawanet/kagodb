/*! webapi.js */

var express = require('express');

/** This mixin provides webapi() method which gives a RESTful Web API feature for {@link http://expressjs.com Express.js}.
 * @class WebapiMixin
 * @mixin
 */

module.exports = function() {
  var mixin = {};
  mixin.webapi = webapi;
  return mixin;
};

/** This generates a RESTful Web API function for {@link http://expressjs.com Express.js}.
 * @method WebapiMixin.prototype.webapi
 * @returns {Function} a Web API function
 * @example
 * var express = require('express');
 * var KagoDB = require('KagoDB');
 * var app = express();
 * var opts = {
 *   storage: 'json',
 *   path: './data/'
 * };
 * app.all('/data/*', KagoDB(opts).webapi());
 * app.listen(3000);
 */

function webapi() {
  var collection = this;
  var System = collection.bundle.system;
  var version = System.version();

  var api = function(req, res, next) {
    var app = new MiniApp();
    app.use(api.bodyParser());
    app.use(api.prepare());
    app.use(api.ready());
    app.verb('put', api.methods.write);
    app.verb('delete', api.methods.erase);
    app.use(api.dispatch(api.methods));
    app.verb('head', api.methods.read);
    app.verb('get', api.methods.read);
    app.use(api.cleanup());
    app.use(api.error(400));
    app.run(req, res, next);
  };

  api.bodyParser = express.bodyParser;

  api.prepare = function() {
    return function(req, res, next) {
      req.kagodb = collection;
      req.kagoapi = api;
      next();
    };
  };

  api.ready = function() {
    return NOOP;
  };

  api.methods = new WebapiMethods();

  api.dispatch = function(methods) {
    methods = methods || api.methods;
    return function(req, res, next) {
      var method = req.param('method');
      if (!method) {
        return next();
      }
      var func = methods[method];
      if (!func) {
        return next();
      }
      func(req, res, next);
    };
  };

  api.cleanup = function() {
    return function(req, res, next) {
      delete req.kagodb;
      delete req.api;
      next();
    };
  };

  api.error = function(code) {
    return function(req, res, next) {
      res.send(code || 500);
    };
  };

  api.parse = function(value) {
    if ('string' !== typeof value) return value;
    try {
      value = JSON.parse(value);
    } catch (err) {
      collection.emit('warn', 'JSON.parse error', err, value);
      value = err;
    }
    return value;
  };

  return api;
}

function NOOP(req, res, next) {
  next();
}

function MiniApp() {}

MiniApp.prototype.use = function(job) {
  this.queue = this.queue || [];
  this.queue.push(job);
  return this;
};

MiniApp.prototype.verb = function(verb, job) {
  var func = function(req, res, next) {
    if (req.method.toLowerCase() == verb) {
      return job(req, res, next);
    } else {
      return next();
    }
  };
  return this.use(func);
};

MiniApp.prototype.run = function(req, res, next) {
  var queue = this.queue || [];
  each();
  return this;

  function each(err) {
    if (err) {
      return next.apply(null, arguments);
    }
    var job = queue.shift();
    if (!job) {
      return next();
    }
    job(req, res, each);
  }
};

function WebapiMethods() {}

WebapiMethods.prototype.read = function(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var id = req.param('id');

  // id must be specified
  if (!id) {
    return next();
  }

  // run
  collection.emit('webapi', 'read', id);
  collection.exist(id, function(err, exist) {
    if (err) {
      collection.emit('warn', 'read: exist failed -', err);
      return res.send(500); // Internal Server Error
    }
    if (!exist) {
      collection.emit('warn', 'read: item does not exist -', id);
      return res.send(404); // Not Found
    }
    collection.read(id, function(err, item) {
      if (err) {
        collection.emit('warn', 'read: read failed -', err);
        return res.send(500); // Internal Server Error
      }
      return res.send(item);
    });
  });
};

WebapiMethods.prototype.write = function(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var id = req.param('id');
  var content = req.param('content');

  // id must be specified
  if (!id) {
    return next();
  }

  // content refers body when PUT
  if (!content && req.method.toLowerCase() == 'put') {
    content = req.body;
  }

  // parse content body
  content = kagoapi.parse(content);

  // validate parameter
  if (!content || 'object' !== typeof content) {
    collection.emit('warn', 'write: invalid content -', content);
    return res.send(400); // Bad Request
  }
  if (content instanceof Error) {
    collection.emit('warn', 'write: content parse failed -', content);
    return res.send(400); // Bad Request
  }
  if (!Object.keys(content).length) {
    collection.emit('warn', 'write: empty content -', content);
    return res.send(400); // Bad Request
  }

  // run
  collection.emit('webapi', 'write', id, content);
  collection.write(id, content, function(err) {
    if (err) {
      collection.emit('warn', 'write: write failed -', err);
      return res.send(500); // Internal Server Error
    }
    return res.send({
      success: true
    });
  });
};

WebapiMethods.prototype.erase = function(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var id = req.param('id');

  // id must be specified
  if (!id) {
    return next();
  }

  // run
  collection.emit('webapi', 'erase', id);
  collection.erase(id, function(err) {
    if (err) {
      collection.emit('warn', 'erase: erase failed -', err);
      return res.send(500); // Internal Server Error
    }
    return res.send({
      success: true
    });
  });
};

WebapiMethods.prototype.exist = function(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var id = req.param('id');

  // id must be specified
  if (!id) {
    return next();
  }

  // run
  collection.emit('webapi', 'exist', id);
  collection.exist(id, function(err, exist) {
    if (err) {
      collection.emit('warn', 'exist: exist failed -', err);
      return res.send(500); // Internal Server Error
    }
    return res.send({
      exist: !! exist
    });
  });
};

WebapiMethods.prototype.index = function(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;

  // run
  collection.emit('webapi', 'index:');
  collection.index(function(err, list) {
    if (err) {
      collection.emit('warn', 'index: index failed -', err);
      return res.send(500); // Internal Server Error
    }
    return res.send({
      index: list
    });
  });
};

WebapiMethods.prototype.find = function(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var condition = req.param('condition');
  var projection = req.param('projection');
  var sort = req.param('sort');
  var offset = req.param('offset');
  var limit = req.param('limit');
  var cursor;

  // translate query parameters
  condition = kagoapi.parse(condition);
  projection = kagoapi.parse(projection);
  sort = kagoapi.parse(sort);
  offset = offset - 0;
  limit = limit - 0;

  // validate parameters
  if (condition instanceof Error) {
    collection.emit('warn', 'find: condition parse failed -', condition);
    return res.send(400); // Bad Request
  }
  if (projection instanceof Error) {
    collection.emit('warn', 'find: projection parse failed -', projection);
    return res.send(400); // Bad Request
  }
  if (sort instanceof Error) {
    collection.emit('warn', 'find: sort parse failed -', sort);
    return res.send(400); // Bad Request
  }

  // run
  collection.emit('webapi', 'find', condition, projection, sort, offset, limit);
  cursor = collection.find(condition, projection);
  if (sort) cursor.sort(sort);
  if (limit) cursor.limit(limit);
  if (offset) cursor.offset(offset);
  cursor.toArray(function(err, list) {
    if (err) {
      collection.emit('warn', 'find: toArray ailed -', err);
      return res.send(500); // Internal Server Error
    }
    return res.send({
      data: list
    });
  });
};

WebapiMethods.prototype.count = function(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var condition = req.param('condition');

  // translate query parameter
  condition = kagoapi.parse(condition);

  // validate parameter
  if (condition instanceof Error) {
    collection.emit('warn', 'count: condition parse failed -', content);
    return res.send(400); // Bad Request
  }

  // run
  collection.emit('webapi', 'count', condition);
  collection.count(condition, function(err, count) {
    if (err) {
      collection.emit('warn', 'count: count failed -', err);
      return res.send(500); // Internal Server Error
    }
    return res.send({
      count: count
    });
  });
};