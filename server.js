/*! server.js */

var express = require('express');
var KagoDB = require('./index');

var opt1 = {
  storage: 'yaml',
  path: './data'
};

var opt2 = {
  storage: 'memory',
  namespace: 'shared',
  primary_key: '_id'
};

var app = express();
app.use(express.static(__dirname + '/public'));
app.all('/data/:id?', KagoDB(opt1).webapi());
app.all('/memory/:id?', KagoDB(opt2).webapi());
app.listen(3000);
