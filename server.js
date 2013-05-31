/*! server.js */

var express = require('express');
var KagoDB = require('./index');

var app = express();

var opts = {
  storage: 'yaml',
  path: 'data'
};

app.all('/data/*', KagoDB(opts).webapi());

app.listen(3000);
