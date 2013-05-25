/*! cursor.test.js */

var assert = require('chai').assert;
var Collection = require('../index').collection;
var async = require('async');

describe('memory', function() {
    var collection;
    var opts = {
        storage: 'memory'
    };

    describe('#cursor', function() {
        collection = new Collection(opts);

        var data = {
            foo: {
                string: "FOO",
                decimal: 123,
                numeric: 45.67
            },
            bar: {
                string: "BAR",
                decimal: 111,
                numeric: 45.67
            },
            baz: {
                string: "BAZ",
                decimal: 999,
                numeric: 11.11
            },
            qux: {
                string: "QUX",
                decimal: 123,
                numeric: 45.67
            }
        };

        var keys = Object.keys(data);

        it('insert records', function(done) {
            async.eachSeries(keys, each, end);

            function each(id, next) {
                collection.write(id, data[id], next);
            }

            function end(err) {
                assert(!err, 'no error');
                done();
            }
        });

        it('count', function(done) {
            collection.count(function(err, count) {
                assert(!err, 'no error');
                assert.equal(count, keys.length, 'count number')
                done();
            });
        });

        it('count', function(done) {
            collection.find().toArray(function(err, list) {
                assert(!err, 'no error');
                assert.equal(list.length, keys.length, 'find length')
                done();
            });
        });

        it('limit 2', function(done) {
            collection.find().limit(2).toArray(function(err, list) {
                assert(!err, 'no error');
                assert.equal(list.length, 2, 'limit 2 length')
                done();
            });
        });

        it('limit 1000', function(done) {
            collection.find().limit(1000).toArray(function(err, list) {
                assert(!err, 'no error');
                assert.equal(list.length, keys.length, 'limit 1000 length')
                done();
            });
        });

        it('sort string desc', function(done) {
            var sort = {
                string: 1
            };
            collection.find().sort(sort).toArray(function(err, list) {
                assert(!err, 'no error');
                assert.equal(list.length, keys.length, 'find length');
                assert.equal(list[0].string, 'BAR', 'BAR/BAZ/FOO/QUX #0');
                assert.equal(list[3].string, 'QUX', 'BAR/BAZ/FOO/QUX #3');
                done();
            });
        });

        it('sort string desc', function(done) {
            var sort = {
                string: -1
            };
            collection.find().sort(sort).toArray(function(err, list) {
                assert(!err, 'no error');
                assert.equal(list.length, keys.length, 'find length');
                assert.equal(list[0].string, 'QUX', 'QUX/FOO/BAZ/BAR #0');
                assert.equal(list[3].string, 'BAR', 'QUX/FOO/BAZ/BAR #3');
                done();
            });
        });

        it('sort decimal asc', function(done) {
            var sort = {
                decimal: 1
            };
            collection.find().sort(sort).toArray(function(err, list) {
                assert(!err, 'no error');
                assert.equal(list.length, keys.length, 'find length');
                assert.equal(list[0].string, 'BAR', 'BAR/FOO/QUX/BAZ #0');
                assert.equal(list[3].string, 'BAZ', 'BAR/FOO/QUX/BAZ #3');
                done();
            });
        });

        it('sort decimal desc', function(done) {
            var sort = {
                decimal: -1
            };
            collection.find().sort(sort).toArray(function(err, list) {
                assert(!err, 'no error');
                assert.equal(list.length, keys.length, 'find length');
                assert.equal(list[0].string, 'BAZ', 'BAZ/QUX/FOO/BAR #0');
                assert.equal(list[3].string, 'BAR', 'BAZ/QUX/FOO/BAR #3');
                done();
            });
        });

        it('sort numeric asc', function(done) {
            var sort = {
                numeric: 1
            };
            collection.find().sort(sort).toArray(function(err, list) {
                assert(!err, 'no error');
                assert.equal(list.length, keys.length, 'find length');
                assert.equal(list[0].string, 'BAZ', 'BAZ/---/---/--- #0');
                done();
            });
        });

        it('sort multiple asc', function(done) {
            var sort = {
                numeric: 1,
                decimal: 1,
                string: 1
            };
            collection.find().sort(sort).toArray(function(err, list) {
                assert(!err, 'no error');
                assert.equal(list.length, keys.length, 'find length');
                assert.equal(list[0].string, 'BAZ', 'BAZ-BAR-FOO-QUX #0');
                assert.equal(list[1].string, 'BAR', 'BAZ-BAR-FOO-QUX #1');
                assert.equal(list[2].string, 'FOO', 'BAZ-BAR-FOO-QUX #2');
                assert.equal(list[3].string, 'QUX', 'BAZ-BAR-FOO-QUX #3');
                done();
            });
        });

        it('sort multiple asc', function(done) {
            var sort = {
                numeric: -1,
                decimal: -1,
                string: -1
            };
            collection.find().sort(sort).toArray(function(err, list) {
                assert(!err, 'no error');
                assert.equal(list.length, keys.length, 'find length');
                assert.equal(list[0].string, 'QUX', 'QUX-FOO-BAR-BAZ #0');
                assert.equal(list[1].string, 'FOO', 'QUX-FOO-BAR-BAZ #1');
                assert.equal(list[2].string, 'BAR', 'QUX-FOO-BAR-BAZ #2');
                assert.equal(list[3].string, 'BAZ', 'QUX-FOO-BAR-BAZ #3');
                done();
            });
        });
    });
});