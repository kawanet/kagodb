/*! server.js */

var express = require('express');
var KagoDB = require('./index');

var opts = {
  storage: 'yaml',
  path: './data'
};

var app = express();
app.use(express.static(__dirname + '/public'));
app.all('/data/*', KagoDB(opts).webapi());
app.listen(3000);
