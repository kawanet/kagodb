/*! server.js */

var express = require('express');
var dbyaml = require('./index');

var app = express();

var opts = {
  path: 'data'
};

app.all('/data/*', dbyaml(opts).express());

app.listen(3000);
