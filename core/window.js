/*! window.js */

var _window;

try {
  _window = window; // running on browser
} catch(err) {
  // running on node.js
}

module.exports = _window || {};
