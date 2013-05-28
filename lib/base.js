/*! base.js */

function inherit(super) {
	function Class(opts) {
		if (!(this instanceof Class)) return new Class(opts);
		opts = opts || {};
		opts.prototype = wrap(Class.opts);
		this.opts = opts;
	}

	Class.prototype = wrap(super.prototype);

	Class.use = function(mixin) {
		mixin.call(Class);
		return Class;
	};

	Class.build = function(opts) {
		return new Class(opts);
	};

	Class.inherit = function() {
		return inherit(Class);
	};

	Class.opts = wrap(super.opts);

	Class.get = function(key) {
		return Class.opts[key];
	};

	Class.set = function(key, val) {
		Class.opts[key] = val;
		return Class;
	};

	return Class;
}

function wrap(object) {
	function F() {}
	F.prototype = object;
	return new F();
}

function Root() {}

Root.prototype.get = function(key) {
	return this.opts[key];
};

Root.prototype.set = function(key, val) {
	this.opts[key] = val;
	return this;
};

module.exports = inherit(Root);
