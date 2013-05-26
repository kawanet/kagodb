/*! dbyaml.express.js */

var _express = require('express');

module.exports = express;

function express(opts) {
  var collection = require('./dbyaml.collection')(opts);

  function execMethod(req, res) {
    var params = getParams(req);
    if (!params.method)
      return res.send(400);

    switch (params.method) {
    case 'read':
      collection.read(params.id, error_check(function(err, item) {
        res.json(item);
      }));
      break;

    case 'write':
      collection.write(params.id, params.content, error_check(function(err) {
        res.json({success: true});
      }));
      break;

    case 'remove':
      collection.remove(params.id, error_check(function(err) {
        res.json({success: true});
      }));
      break;

    case 'exists':
      collection.exists(params.id, error_check(function(err, exist) {
        res.json({exist: exist});
      }));
      break;

    case 'find':
      var cursor = collection.find(params.condition);
      if (params.limit) cursor.limit(params.limit);
      if (params.offset) cursor.offset(params.offset);
      if (params.sort) cursor.sort(params.sort);
      cursor.toArray(error_check(function(err, list) {
        res.json({data: list});
      }));
      break;

    case 'count':
      collection.count(params.condition, error_check(function(err, count) {
        res.json({count: count});
      }));
      break;

    default:
      res.send(400);
      break;
    }
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

  function error_check(callback) {
    return function(err) {
      if (err) {
        console.error(err);
        return res.send(500);
      }
      callback.apply(null, arguments);
    };
  }

  return function(req, res) {
    _express.bodyParser()(req, res, function() {
      execMethod(req, res);
    });
  };
}
