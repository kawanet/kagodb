/*! webapi.js */

var express; // = require('express'); // lazy load
var WebapiMethods = require('./webapi_methods');

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
