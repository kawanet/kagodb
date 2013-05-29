/*! core/cursor.js */

var async = require('async');

module.exports = function() {
	this.prototype.find = mixin_find;
	this.prototype.count = mixin_count;
};

function mixin_find(condition, callback) {
	callback = callback || NOP;
	var cursor = new Cursor(this, condition);
	callback(null, cursor);
	return cursor;
};

function mixin_count(condition, callback) {
	callback = callback || NOP;
	var cursor = this.find(condition);
	cursor.count(callback);
	return this;
};

function Cursor(collection, condition) {
	this.collection = collection;
	this.condition = condition;
	this.filters = {};
}

Cursor.prototype.keys = keys;
Cursor.prototype.toArray = toArray;
Cursor.prototype.count = count;
Cursor.prototype.sort = sort;
Cursor.prototype.offset = offset;
Cursor.prototype.limit = limit;

function keys(callback) {
	var self = this;
	callback = callback || NOP;
	if (self._keys) {
		callback(null, self._keys);
	} else {
		self.collection.keys(function(err, list) {
			callback(err, self._keys = list);
		});
	}
	return this;
}

function toArray(callback) {
	var self = this;
	callback = callback || NOP;
	if (self._values) {
		callback(null, self._values);
	} else {
		self.keys(function(err, list) {
			var buf = [];
			if (err) {
				callback(err);
			} else {
				async.eachSeries(list, each, end);
			}

			function each(id, next) {
				self.collection.read(id, function(err, item) {
					buf.push(item);
					next(err);
				});
			}

			function end(err) {
				if (self.filters.sort) {
					buf = self.filters.sort(buf);
				}
				if (self.filters.offset) {
					buf = self.filters.offset(buf);
				}
				if (self.filters.limit) {
					buf = self.filters.limit(buf);
				}

				callback(err, self._values = buf);
			}
		});
	}
	return this;
}

function count(callback) {
	callback = callback || NOP;
	this.keys(function(err, list) {
		if (err) {
			callback(err);
		} else {
			callback(null, list.length);
		}
	});
	return this;
};

function sort(param) {
	var keys = Object.keys(param);
	var keylen = keys.length;
	var func = function(a, b) {
		for (var i = 0; i < keylen; i++) {
			var key = keys[i];
			if (a[key] < b[key]) {
				return -param[key];
			} else if (a[key] > b[key]) {
				return param[key];
			}
		}
	};
	this.filters.sort = function(list) {
		return list.sort(func);
	};
	return this;
}

function offset(offset) {
	this.filters.offset = function(list) {
		return list.splice(offset);
	};
	return this;
}

function limit(limit) {
	this.filters.limit = function(list) {
		return list.splice(0, limit);
	};
	return this;
}

function NOP() {}