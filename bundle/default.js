/*! default.js */

var fs = require('fs');
var Common = require('./common');
var webapi = require('../mixin/webapi');

var KagoDB = Common.inherit();
KagoDB.mixin(webapi());

bundle('../core');
bundle('../storage');
bundle('../mixin');

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