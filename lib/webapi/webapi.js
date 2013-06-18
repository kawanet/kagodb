/*! webapi.js */

var express; // = require('express'); // lazy load
var WebMethods = require('./webmethods');

/**
 * This mixin provides
 * [webapi()]{@linkcode KagoDB#webapi} and
 * [webmethods()]{@linkcode KagoDB#webmethods} and
 * method to implement a RESTful Web API feature for
 * {@link http://expressjs.com Express.js}.
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
  mixin.webmethods = webmethods;
  return mixin;
};

function webmethods() {
  return new WebMethods();
}

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
    var app = mw_pipe();
    app.use(api.bodyParser());
    app.use(api.prepare());
    app.use(api.ready());
    app.use(verb('put', api.methods.write));
    app.use(verb('delete', api.methods.erase));
    app.use(api.dispatch(api.methods));
    app.use(verb('head', api.methods.read));
    app.use(verb('get', api.methods.read));
    app.use(api.cleanup());
    app.use(api.error(400));
    app.run(req, res, next);
  };

  express = express || require('express'); // lazy load

  api.express = express; // export express

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

  api.methods = collection.webmethods();

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

function mw_pipe() {
  function mw() {}
  mw.run = NOOP;
  mw.use = function(job) {
    mw.run = mw_join(mw.run, job);
  };
  return mw;
}

function mw_join(first, second) {
  return function(req, res, next) {
    var that = this;
    first.call(that, req, res, function() {
      second.call(that, req, res, next);
    });
  };
}

function verb(method, job) {
  return function(req, res, next) {
    if (req.method.toLowerCase() == method) {
      job(req, res, next);
    } else {
      next();
    }
  };
}

function NOOP(req, res, next) {
  next();
}
