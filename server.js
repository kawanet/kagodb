/*! server.js */

var express = require('express');
var dbyaml = require('./index');

var app = express();

var opts = {
  path: 'data'
};

app.all('/data/*', dbyaml.express(opts));

app.listen(3000);
