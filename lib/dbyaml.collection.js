/*! dbyaml.collection.js */

var fs = require('fs');
var jsyaml = require('js-yaml');
var async = require('async');

module.exports = Collection;

function Collection(opts) {
	if (!(this instanceof Collection)) return new Collection(opts);
	this.opts = opts;
};

Collection.prototype.path = path;
Collection.prototype.read = read;
Collection.prototype.write = write;
Collection.prototype.remove = remove;
Collection.prototype.exists = exists;
Collection.prototype.find = find;
Collection.prototype.count = count;

function path(id) {
	return this.opts.path + "/" + id + ".yaml";
}

function read(id, callback) {
	callback = callback || NOP;
	var path = this.path(id);
	fs.readFile(path, 'utf8', function(err, content) {
		if (err) {
			callback(err);
		} else {
			var item = jsyaml.load(content);
			callback(null, item);
		}
	});
}

function write(id, item, callback) {
	var path = this.path(id);
	var yaml = jsyaml.dump(item);
	fs.writeFile(path, yaml, 'utf8', callback);
};

function remove(id, callback) {
	var path = this.path(id);
	fs.unlink(path, callback)
};

function exists(id, callback) {
	var file = this.path(id);
	fs.stat(file, function(err, stat) {
		callback(err, !! stat);
	});
};

function find(condition, callback) {
	callback = callback || NOP;
	var cursor = new Cursor(this, condition);
	callback(cursor);
	return cursor;
};

function count(condition, callback) {
	callback = callback || NOP;
	this.find(condition, function(err, cursor) {
		if (err) {
			callback(err);
		} else {
			cursor.count(callback);
		}
	});
};

function Cursor(collection, condition) {
	this.collection = collection;
	this.condition = condition;
}

Cursor.prototype.toArray = toArray;
Cursor.prototype.count = count;
Cursor.prototype.sort = sort;
Cursor.prototype.offset = offset;
Cursor.prototype.limit = limit;

function toArray(callback) {
	callback = callback || NOP;
	var collection = this.collection;
	fs.readdir(collection.opts.path, function(err, list) {
		list = list.filter(function(file) {
			return (file.search(/\.yaml$/i) > -1);
		});
		var buf = [];
		async.eachSeries(list, read, end);

		function read(file, next) {
			var id = file.replace(/\.yaml$/i, "");
			collection.read(id, push);

			function push(err, item) {
				if (err) {
					next(err);
				} else {
					buf.push(item);
					next();
				}
			}
		}

		function end(err) {
			callback(err, buf);
		}
	});
};

function count(callback) {
	callback = callback || NOP;
	this.toArray(function(err, array) {
		if (err) {
			callback(err);
		} else {
			callback(null, array.length);
		}
	});
};

// TODO: 

function sort(sort, callback) {
	return this;
};

// TODO: 

function offset(offset, callback) {
	return this;
};

// TODO: 

function limit(limit, callback) {
	return this;
};

function NOP() {}