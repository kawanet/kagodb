/*! client.js */

var Base = require('../../core/base');
var storage = require('../../mixin/storage');
var cursor = require('../../mixin/find');
var memory = require('../../storage/memory');

var KagoDB = Base.inherit();
KagoDB.mixin(storage);
KagoDB.mixin(cursor);
KagoDB.set('storage', memory);

module.exports = KagoDB;
