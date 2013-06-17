/*! default.js */

var fs = require('fs');
var Common = require('./common');
var KagoDB = Common.inherit();

// bundle all mixins per default
bundle('../lib/ajax');
bundle('../lib/core');
bundle('../lib/mixin');
bundle('../lib/query');
bundle('../lib/storage');
bundle('../lib/webapi');

KagoDB.mixin(KagoDB.bundle.webapi());

module.exports = KagoDB;

function bundle(path) {
  var base = __dirname + '/' + path;
  var list = fs.readdirSync(base);
  list = list.filter(function(name) {
    return name.search(/\.js$/) > -1;
  });
  list = list.map(function(name) {
    return name.replace(/\.js$/, '');
  });
  list.forEach(function(name) {
    var path = base + '/' + name;
    KagoDB.bundle[name] = require(path);
  });
}
