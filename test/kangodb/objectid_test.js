/**
 * @see https://github.com/mongodb/node-mongodb-native/blob/master/test/tests/functional/objectid_tests.js
 */

/**
 * Generate 12 byte binary string representation using a second based timestamp or
 * default value
 *
 * @_class objectid
 * @_function getTimestamp
 * @ignore
 */
exports.shouldCorrectlyGenerate12ByteStringFromTimestamp = function(configuration, test) {
  var ObjectID = configuration.getMongoPackage().ObjectID;
  // DOC_START
  // Get a timestamp in seconds
  var timestamp = Math.floor(new Date().getTime()/1000);
  // Create a date with the timestamp
  var timestampDate = new Date(timestamp*1000);

  // Create a new ObjectID with a specific timestamp
  var objectId = new ObjectID(timestamp);

  // Get the timestamp and validate correctness
  test.equal(timestampDate.toString(), objectId.getTimestamp().toString());
  test.done();
  // DOC_END
}

/**
 * Generate a 24 character hex string representation of the ObjectID
 *
 * @_class objectid
 * @_function toHexString
 * @ignore
 */
exports.shouldCorrectlyRetrieve24CharacterHexStringFromToString1 = function(configuration, test) {
  var ObjectID = configuration.getMongoPackage().ObjectID;
  // DOC_START
  // Create a new ObjectID
  var objectId = new ObjectID();
  // Verify that the hex string is 24 characters long
  test.equal(24, objectId.toHexString().length);
  test.done();
  // DOC_END
}

/**
 * Get and set the generation time for an ObjectID
 *
 * @_class objectid
 * @_function generationTime
 * @ignore
 */
exports.shouldCorrectlyGetAndSetObjectIDUsingGenerationTimeProperty = function(configuration, test) {
  var ObjectID = configuration.getMongoPackage().ObjectID;
  // DOC_START
  // Create a new ObjectID
  var objectId = new ObjectID();
  // Get the generation time
  var generationTime = objectId.generationTime;
  // Add 1000 miliseconds to the generation time
  objectId.generationTime = generationTime + 1000;

  // Create a timestamp
  var timestampDate = new Date();
  timestampDate.setTime((generationTime + 1000) * 1000);

  // Get the timestamp and validate correctness
  test.equal(timestampDate.toString(), objectId.getTimestamp().toString());
  test.done();
  // DOC_END
}

/**
 * @ignore
 */
exports.shouldCorrectlyRetrieve24CharacterHexStringFromToString2 = function(configuration, test) {
  var ObjectID = configuration.getMongoPackage().ObjectID;
  // Create a new ObjectID
  var objectId = new ObjectID();
  // Verify that the hex string is 24 characters long
  test.equal(24, objectId.toString().length);
  test.done();
}

/**
 * @ignore
 */
exports.shouldCorrectlyRetrieve24CharacterHexStringFromToString3 = function(configuration, test) {
  var ObjectID = configuration.getMongoPackage().ObjectID;
  // Create a new ObjectID
  var objectId = new ObjectID();
  // Verify that the hex string is 24 characters long
  test.equal(24, objectId.toJSON().length);
  test.done();
}

/**
 * Convert a ObjectID into a hex string representation and then back to an ObjectID
 *
 * @_class objectid
 * @_function ObjectID.createFromHexString
 * @ignore
 */
exports.shouldCorrectlyTransformObjectIDToAndFromHexString1 = function(configuration, test) {
  var ObjectID = configuration.getMongoPackage().ObjectID;
  // DOC_START
  // Create a new ObjectID
  var objectId = new ObjectID();
  // Convert the object id to a hex string
  var originalHex = objectId.toHexString();
  // Create a new ObjectID using the createFromHexString function
  var newObjectId = new ObjectID.createFromHexString(originalHex)
  // Convert the new ObjectID back into a hex string using the toHexString function
  var newHex = newObjectId.toHexString();
  // Compare the two hex strings
  test.equal(originalHex, newHex);
  test.done();
  // DOC_END
}

/**
 * Compare two different ObjectID's using the equals method
 *
 * @_class objectid
 * @_function equals
 * @ignore
 */
exports.shouldCorrectlyTransformObjectIDToAndFromHexString2 = function(configuration, test) {
  var ObjectID = configuration.getMongoPackage().ObjectID;
  // DOC_START
  // Create a new ObjectID
  var objectId = new ObjectID();
  // Create a new ObjectID Based on the first ObjectID
  var objectId2 = new ObjectID(objectId.id);
  // Create another ObjectID
  var objectId3 = new ObjectID();

  // objectId and objectId2 should be the same
  test.ok(objectId.equals(objectId2), 'objectId and objectId2 should be the same');
  // objectId and objectId2 should be different
  test.ok(!objectId.equals(objectId3), 'objectId and objectId2 should be different');
  test.done();
  // DOC_END
}

/**
 * @ignore
 */
exports.shouldCorrectlyGenerateObjectIDFromTimestamp = function(configuration, test) {
  var ObjectID = configuration.getMongoPackage().ObjectID;

  var timestamp = Math.floor(new Date().getTime()/1000);
  var objectID = new ObjectID(timestamp);
  var time2 = objectID.generationTime;
  test.equal(timestamp, time2);
  test.done();
}

/**
 * @ignore
 */
exports.shouldCorrectlyCreateAnObjectIDAndOverrideTheTimestamp = function(configuration, test) {
  var ObjectID = configuration.getMongoPackage().ObjectID;

  var timestamp = 1000;
  var objectID = new ObjectID();
  var id1 = objectID.id;
  // Override the timestamp
  objectID.generationTime = timestamp
  var id2 = objectID.id;
  // Check the strings
  test.equal(id1.substr(4), id2.substr(4));
  test.done();
}

/**
 * Show the usage of the Objectid createFromTime function
 *
 * @_class objectid
 * @_function ObjectID.createFromTime
 * @ignore
 */
exports.shouldCorrectlyTransformObjectIDToAndFromHexString3 = function(configuration, test) {
  var ObjectID = configuration.getMongoPackage().ObjectID;
  // DOC_START
  var objectId = ObjectID.createFromTime(1);
  test.equal("000000010000000000000000", objectId.toHexString());
  test.done();
  // DOC_END
}