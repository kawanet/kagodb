/*! dbyaml.collection.js */

var storages = {
	yaml: require('./storage/yaml'),
	memory: require('./storage/memory')
}

module.exports = Collection;

function Collection(opts) {
	if (!(this instanceof Collection)) return new Collection(opts);
	this.opts = opts || {};
};

Collection.prototype.read = read;
Collection.prototype.write = write;
Collection.prototype.remove = remove;
Collection.prototype.exists = exists;
Collection.prototype.keys = keys;
Collection.prototype.storage = storage;

function read(id, callback) {
	this.storage().read(id, callback);
}

function write(id, item, callback) {
	this.storage().write(id, item, callback);
};

function remove(id, callback) {
	this.storage().remove(id, callback);
};

function exists(id, callback) {
	this.storage().exists(id, callback);
};

function keys(callback) {
	this.storage().keys(callback);
};

function storage(storage) {
	if (storage) {
		this._storage = storage;
	}
	if (!this._storage) {
		var engineName = this.opts.storage || 'yaml';
		var engineClass = storages[engineName];
		this._storage = new engineClass(this.opts);
	}
	return this._storage;
};