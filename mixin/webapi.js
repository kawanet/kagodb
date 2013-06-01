/*! webapi.js */

var express = require('express');

/** This mixin provides webapi() method which gives a RESTful Web API feature for {@link http://expressjs.com Express.js}.
 * @class WebapiMixin
 * @mixin
 */

module.exports = function() {
  this.webapi = webapi;
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
  var f;

  f = function(req, res) {
    var parser = collection.get('webapi-preprocess') || express.bodyParser();
    var responder = collection.get('webapi-responder') || res.send;
    responder = responder.bind(res);

    parser(req, res, function() {
      var params = f.getParams(req);
      if (!params.method) {
        return responder(400); // Bad Request
      }

      var method = f.methods[params.method];
      if (!method) {
        return responder(400); // Bad Request
      }
      method(collection, params, responder);
    });
  };

  f.getParams = getParams;
  f.methods = new WebapiMethods();

  return f;
}

function WebapiMethods() {}

WebapiMethods.prototype.read = function(collection, params, next) {
  collection.exists(params.id, function(err, exist) {
    if (err) {
      console.error('read:', err);
      return next(500); // Internal Server Error
    }
    if (!exist) {
      return next(404); // Not Found
    }
    collection.read(params.id, function(err, item) {
      if (err) {
        console.error('read:', err);
        return next(500); // Internal Server Error
      }
      next(item);
    });
  })
};

WebapiMethods.prototype.write = function(collection, params, next) {

  collection.write(params.id, params.content, function(err) {
    if (err) {
      console.error('write:', err);
      return next(500); // Internal Server Error
    }
    next({
      success: true
    });
  });
};

WebapiMethods.prototype.remove = function(collection, params, next) {
  collection.remove(params.id, function(err) {
    if (err) {
      console.error('remove:', err);
      return next(500); // Internal Server Error
    }
    next({
      success: true
    });
  });
};

WebapiMethods.prototype.exists = function(collection, params, next) {
  collection.exists(params.id, function(err, exist) {
    if (err) {
      console.error('exists:', err);
      return next(500); // Internal Server Error
    }
    if (req.method.toLowerCase() === 'head') {
      next(exist ? 200 : 404);
    } else {
      next({
        exist: !! exist
      });
    }
  });
};

WebapiMethods.prototype.find = function(collection, params, next) {
  var cursor = collection.find(params.condition);
  if (params.limit) cursor.limit(params.limit);
  if (params.offset) cursor.offset(params.offset);
  if (params.sort) cursor.sort(params.sort);
  cursor.toArray(function(err, list) {
    if (err) {
      console.error('find:', err);
      return next(500); // Internal Server Error
    }
    next({
      data: list
    });
  });
};

WebapiMethods.prototype.count = function(collection, params, next) {
  collection.count(params.condition, function(err, count) {
    if (err) {
      console.error('count:', err);
      return next(500); // Internal Server Error
    }
    next({
      count: count
    });
  });
};

function getParams(req) {
  var params = req.query;

  if (!params.method) {
    var http_method = req.method.toLowerCase();
    params.id = req.params[0];
    switch (http_method) {
      case 'get':
        if (params.id) {
          params.method = 'read';
        } else {
          params.method = 'find';
        }
        break;

      case 'put':
        params.method = 'write';
        params.content = req.body;
        break;

      case 'delete':
        params.method = 'remove';
        break;

      case 'head':
        params.method = 'exists';
        break;
    }
  }

  if (typeof params.content === 'string') {
    params.content = contentParser(params.content);
  }

  return params;
}

function contentParser(content) {
  var body;
  try {
    body = JSON.parse(content);
  } catch (e) {
    console.error(e, content);
  }
  return body;
}