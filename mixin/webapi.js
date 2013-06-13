/*! webapi.js */

var express; // = require('express'); // lazy load

/**
 * This mixin provides [webapi()]{@linkcode KagoDB#webapi} method which gives a RESTful Web API feature for {@link http://expressjs.com Express.js}.
 *
 * @class webapi
 * @mixin
 * @example
 * var express = require('express');
 * var KagoDB = require('KagoDB');
 *
 * var opts = {
 *   storage: 'json',
 *   path: './data/'
 * };
 *
 * var app = express();
 * app.use(express.static(__dirname + '/public'));
 * app.all('/data/:id?', KagoDB(opts).webapi());
 * app.listen(3000);
 */

module.exports = function() {
  var mixin = {};
  mixin.webapi = webapi;
  return mixin;
};

/**
 * This generates a RESTful Web API function for {@link http://expressjs.com Express.js}.
 *
 * @method KagoDB.prototype.webapi
 * @returns {Function} a Web API function
 * @example
 * var express = require('express');
 * var KagoDB = require('KagoDB');
 *
 * var opts = {
 *   storage: 'json',
 *   path: './data/'
 * };
 *
 * var app = express();
 * app.use(express.static(__dirname + '/public'));
 * app.all('/data/:id?', KagoDB(opts).webapi());
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

  express = express || require('express'); // lazy load
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
  var id = req.param('id');

  // id must be specified
  if (!id) {
    return next();
  }

  parse_content(req, res, function(content) {
    collection.emit('webapi', 'write', id, content);
    collection.write(id, content, response);
  });

  function response(err) {
    if (err) {
      collection.emit('warn', err);
      return res.send(500); // Internal Server Error
    } else {
      return res.send({
        success: true
      });
    }
  }
};

WebapiMethods.prototype.erase = function(req, res, next) {
  var collection = req.kagodb;
  var id = req.param('id');

  // id must be specified
  if (!id) {
    return next();
  }

  // run
  collection.emit('webapi', 'erase', id);
  collection.erase(id, response);

  function response(err) {
    if (err) {
      collection.emit('warn', err);
      return res.send(500); // Internal Server Error
    } else {
      return res.send({
        success: true
      });
    }
  }
};

WebapiMethods.prototype.exist = function(req, res, next) {
  var collection = req.kagodb;
  var id = req.param('id');

  // id must be specified
  if (!id) {
    return next();
  }

  // run
  collection.emit('webapi', 'exist', id);
  collection.exist(id, response);

  function response(err, exist) {
    if (err) {
      collection.emit('warn', 'exist: exist failed -', err);
      return res.send(500); // Internal Server Error
    }
    return res.send({
      exist: !! exist
    });
  }
};

WebapiMethods.prototype.index = function(req, res, next) {
  var collection = req.kagodb;

  // run
  collection.emit('webapi', 'index:');
  collection.index(response);

  function response(err, list) {
    if (err) {
      collection.emit('warn', 'index: index failed -', err);
      return res.send(500); // Internal Server Error
    }
    return res.send({
      index: list
    });
  }
};

WebapiMethods.prototype.find = function(req, res, next) {
  var collection = req.kagodb;
  var offset = req.param('offset');
  var limit = req.param('limit');
  var cursor;

  parse_condition(req, res, function(condition) {
    parse_projection(req, res, function(projection) {
      parse_sort(req, res, function(sort) {
        cursor = collection.find(condition, projection);
        if (sort) cursor.sort(sort);
        if (limit) cursor.limit(limit);
        if (offset) cursor.offset(offset);
        cursor.toArray(response);
      });
    });
  });

  function response(err, list) {
    if (err) {
      collection.emit('warn', 'find: toArray failed -', err);
      return res.send(500); // Internal Server Error
    }
    return res.send({
      data: list
    });
  }
};

WebapiMethods.prototype.count = function(req, res, next) {
  var collection = req.kagodb;

  parse_condition(req, res, function(condition) {
    collection.emit('webapi', 'count', condition);
    collection.count(condition, response);
  });

  function response(err, count) {
    if (err) {
      collection.emit('warn', 'count: count failed -', err);
      return res.send(500); // Internal Server Error
    }
    return res.send({
      count: count
    });
  }
};

WebapiMethods.prototype.insert = function(req, res, next) {
  var collection = req.kagodb;

  parse_content(req, res, function(content) {
    collection.emit('webapi', 'insert', content);
    collection.insert(content, response);
  });

  function response(err) {
    if (err) {
      collection.emit('warn', err);
      return res.send(500); // Internal Server Error
    } else {
      return res.send({
        success: true
      });
    }
  }
};

WebapiMethods.prototype.save = function(req, res, next) {
  var collection = req.kagodb;

  parse_content(req, res, function(content) {
    collection.emit('webapi', 'save', content);
    collection.save(content, response);
  });

  function response(err) {
    if (err) {
      collection.emit('warn', err);
      return res.send(500); // Internal Server Error
    } else {
      return res.send({
        success: true
      });
    }
  }
};

WebapiMethods.prototype.update = function(req, res, next) {
  var collection = req.kagodb;

  parse_condition(req, res, function(condition) {
    parse_update(req, res, function(update) {
      parse_options(req, res, function(options) {
        collection.emit('webapi', 'update', condition, update, options);
        collection.update(condition, update, options, response);
      });
    });
  });

  function response(err) {
    if (err) {
      collection.emit('warn', err);
      return res.send(500); // Internal Server Error
    } else {
      return res.send({
        success: true
      });
    }
  }
};

WebapiMethods.prototype.remove = function(req, res, next) {
  var collection = req.kagodb;

  parse_condition(req, res, function(condition) {
    parse_options(req, res, function(options) {
      var justOne = options && !options.multi;
      collection.emit('webapi', 'remove', condition, justOne);
      collection.remove(condition, justOne, response);
    });
  });

  function response(err) {
    if (err) {
      collection.emit('warn', err);
      return res.send(500); // Internal Server Error
    } else {
      return res.send({
        success: true
      });
    }
  }
};

function parse_sort(req, res, next) {
  var collection = req.kagodb;
  var kagoapi = req.kagoapi;
  var sort = req.param('sort');

  // translate query parameters
  sort = kagoapi.parse(sort);

  // validate parameters
  if (sort instanceof Error) {
    collection.emit('warn', 'sort parse failed -', sort);
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
    collection.emit('warn', 'update parse failed -', update);
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
    collection.emit('warn', 'projection parse failed -', projection);
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
    collection.emit('warn', 'options parse failed -', options);
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
    collection.emit('warn', 'condition parse failed -', condition);
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
    collection.emit('warn', 'invalid content -', content);
    return res.send(400); // Bad Request
  }
  if (content instanceof Error) {
    collection.emit('warn', 'content parse failed -', content);
    return res.send(400); // Bad Request
  }
  if (!Object.keys(content).length) {
    collection.emit('warn', 'empty content -', content);
    return res.send(400); // Bad Request
  }

  next(content);
}