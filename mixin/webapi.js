/*! webapi.js */

var express = require('express');

/** This mixin provides webapi() method which gives a RESTful Web API feature for Express.js.
 * @class WebapiMixin
 * @mixin
 */

module.exports = function() {
  this.webapi = webapi;
};

/** generates a Web API function for express.js
 * @method WebapiMixin.prototype.webapi
 * @returns {Function} a Web API function
 */

function webapi() {
  var collection = this;
  var f;

  f = function(req, res) {
    express.bodyParser()(req, res, function() {
      var params = f.getParams(req);
      if (!params.method)
        return res.send(400);

      if (!f.methods[params.method])
        return res.send(400);

      f.methods[params.method](req, res, collection, params);
    });
  };

  f.getParams = getParams;
  f.methods = new WebapiMethods();

  return f;
}

function WebapiMethods() {}

WebapiMethods.prototype.read = function(req, res, collection, params) {
  collection.read(params.id, errorCheck(function(err, item) {
    res.json(item);
  }));
};

WebapiMethods.prototype.write = function(req, res, collection, params) {
  collection.write(params.id, params.content, errorCheck(function(err) {
    res.json({
      success: true
    });
  }));
};

WebapiMethods.prototype.remove = function(req, res, collection, params) {
  collection.remove(params.id, errorCheck(function(err) {
    res.json({
      success: true
    });
  }));
};

WebapiMethods.prototype.exists = function(req, res, collection, params) {
  collection.exists(params.id, errorCheck(function(err, exist) {
    if (req.method.toLowerCase() === 'head') {
      res.send(exist ? 200 : 404);
    } else {
      res.json({
        exist: exist
      });
    }
  }));
};

WebapiMethods.prototype.find = function(req, res, collection, params) {
  var cursor = collection.find(params.condition);
  if (params.limit) cursor.limit(params.limit);
  if (params.offset) cursor.offset(params.offset);
  if (params.sort) cursor.sort(params.sort);
  cursor.toArray(errorCheck(function(err, list) {
    res.json({
      data: list
    });
  }));
};

WebapiMethods.prototype.count = function(req, res, collection, params) {
  collection.count(params.condition, errorCheck(function(err, count) {
    res.json({
      count: count
    });
  }));
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
    try {
      params.content = JSON.parse(params.content);
    } catch (e) {
      console.error(e, params.content);
      params.content = null;
    }
  }

  return params;
}

function errorCheck(callback) {
  return function(err) {
    if (err) {
      console.error(err);
      return res.send(500);
    }
    callback.apply(null, arguments);
  };
}