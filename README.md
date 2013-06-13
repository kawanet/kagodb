# KagoDB

Kago Database Engine

## Features

- NoSQL
- Minimal and extendable
- Node.js server and client as well as browser build
- Standalone and embeddable
- Basic CRUD operations: write/read/erase etc.
- MongoDB-like operations: insert/find/update/remove etc.
- YAML/JSON file based storage engines
- Memory based volatile storage engine
- RESTful API Web server application ready for Express.js
- RESTful API Web client library for jQuery and superagent
- More features!

## Examples

### JavaScript API

```js
var KagoDB = require('kagodb');

var opts = { storage: 'yaml', path: './data/' };
var collection = new KagoDB(opts);
collection.read('foo', function(err, item) {
  item.updated_at = new Date;
  collection.write('foo', item, function(err) {
    collection.find().toArray(function(err, list) {
      list.forEach(function(item) {
        console.log(JSON.stringify(item));
      });
    });
  });
});
```

### Web API Server

```js
var express = require('express');
var KagoDB = require('kagodb');

var app = express();
var opts = { storage: 'yaml', path: './data/' };
app.all('/data/*', KagoDB(opts).webapi());
app.listen(3000);
```

## Installation

```sh
npm install git://github.com/kawanet/kagodb.git
```

## Links

- Sources on GitHub - https://github.com/kawanet/kagodb
- JavaScript API Documentation - http://kawanet.github.io/kagodb/docs/KagoDB.html

## Authors

- @kawanet
- @mitsumitsu123

## MIT Licence

Copyright 2013 @kawanet

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
