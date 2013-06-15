/*! objectid.js */

/**
 * This generates MongoDB-style ObjectID.
 *
 * @class ObjectID
 * @see http://docs.mongodb.org/manual/reference/object-id/
 * @example
 * var ObjectID = KagoDB.bundle.objectid;
 *
 * var id = new ObjectID(); // => such as '51b96d2a845cca7213000002'
 */

module.exports = ObjectID;

function ObjectID(source) {
  if (!(this instanceof ObjectID)) return new ObjectID(source);

  // http://docs.mongodb.org/manual/reference/mongodb-extended-json/#data_oid
  var str;
  if (source instanceof ObjectID) {
    str = source.$oid;
  } else if (typeof(source) == 'object' && source && source.$oid) {
    str = source.$oid;
  } else if (typeof(source) == 'string') {
    str = source;
  }
  if (!str) {
    this.$oid = getDefaultStyle(source);
  } else if (str.length == 24) {
    this.$oid = str;
  } else if (str.length == 12) {
    this.$oid = parseOctets(str);
  } else if (str.length > 0) {
    throw new Error('Invalid source ObjectID: ' + source);
  }
}

ObjectID.prototype = {
  // objectid_test.js uses this undocumented property.
  // get generationTime() { // getter
  getGenerationTime: function() {
    return parseInt(this.$oid.substr(0, 8), 16);
  },

  // set generationTime(timestamp) { // setter
  setGenerationTime: function(timestamp) {
    var ts = ('00000000' + (timestamp.toString(16))).substr(-8, 8);
    var rest = this.$oid.substr(8);
    var list = [ts, rest];
    this.$oid = list.join('');
  },

  toHexString: function() {
    return this.$oid;
  },

  // http://mongodb.github.com/node-mongodb-native/api-bson-generated/objectid.html#gettimestamp
  getTimestamp: function() {
    var time = parseInt(this.$oid.substr(0, 8), 16);
    return new Date(time * 1000);
  },

  equals: function(test) {
    return this + '' == test;
  },

  toOctets: function() {
    var str = this.toHexString();
    var tmp = [];
    var len = str.length;
    for (var i = 0; i < len; i += 2) {
      var hex = str.substr(i, 2);
      var code = parseInt(hex, 16);
      tmp.push(code);
    }
    return String.fromCharCode.apply(null, tmp);
  }
};

ObjectID.prototype.valueOf = ObjectID.prototype.toHexString;
ObjectID.prototype.toString = ObjectID.prototype.toHexString;
ObjectID.prototype.toJSON = ObjectID.prototype.toHexString;

// http://mongodb.github.com/node-mongodb-native/api-bson-generated/objectid.html#objectid-createfromtime
ObjectID.createFromTime = function(time) {
  time = Math.floor(time) || 0;
  var ts = ('00000000' + (time.toString(16))).substr(-8, 8);
  var mac = '000000';
  var pid = '0000';
  var seq = '000000';
  var list = [ts, mac, pid, seq];
  var hex = list.join('');
  return new ObjectID(hex);
};

// http://mongodb.github.com/node-mongodb-native/api-bson-generated/objectid.html#objectid-createfromhexstring
ObjectID.createFromHexString = function(source) {
  return new ObjectID(source);
};

// 12 octets == Latin-1 12 bytes != UTF-8 12 bytes

function parseOctets(source) {
  var tmp = [];
  var len = source.length;
  for (var i = 0; i < len; i++) {
    var chr = source.charCodeAt(i);
    var hex = chr.toString(16);
    if (hex.length == 1) {
      hex = '0' + hex;
    }
    tmp.push(hex);
  }
  return tmp.join('');
}

function getDefaultStyle(source) {
  var date = (source instanceof Date) ? source : new Date();
  var timestamp = Math.floor(date.getTime() / 1000);
  var machineId = ObjectID._machineId || (ObjectID._machineId = Math.floor(Math.random() * 0x1000000));
  var processId = ObjectID._processId || (ObjectID._processId = Math.floor(Math.random() * 0x10000));
  if (!ObjectID._globalSeq) ObjectID._globalSeq = 0;
  var globalSeq = ++ObjectID._globalSeq;
  var ts = ('00000000' + (timestamp.toString(16))).substr(-8, 8);
  var mac = ('000000' + (machineId.toString(16))).substr(-6, 6);
  var pid = ('0000' + (processId.toString(16))).substr(-4, 4);
  var seq = ('000000' + (globalSeq.toString(16))).substr(-6, 6);
  var list = [ts, mac, pid, seq];
  return list.join('');
}