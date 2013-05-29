/*! storage/yaml.js */

var fs = require('fs');
var jsyaml = require('js-yaml');

module.exports = YAMLStore;

function YAMLStore(opts) {
	if (!(this instanceof YAMLStore)) return new YAMLStore(opts);
	this.opts = opts || {};
};

YAMLStore.prototype.path = path;
YAMLStore.prototype.read = read;
YAMLStore.prototype.write = write;
YAMLStore.prototype.remove = remove;
YAMLStore.prototype.exists = exists;
YAMLStore.prototype.keys = keys;

function path(id) {
	var base = this.opts.path || 'data';
	return base + '/' + id + '.yaml';
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
}

function remove(id, callback) {
	var path = this.path(id);
	fs.unlink(path, callback)
}

function exists(id, callback) {
	var file = this.path(id);
	fs.stat(file, function(err, stat) {
		callback(null, !! stat);
	});
}

function keys(callback) {
	callback = callback || NOP;
	fs.readdir(this.opts.path, function(err, list) {
		if (err) {
			callback(err);
		} else {
			list = list.filter(function(file) {
				return (file.search(/\.yaml$/i) > -1);
			});
			list = list.map(function(file) {
				return file.replace(/\.yaml$/i, '');
			});
			callback(null, list);
		}
	});
}

function NOP() {}