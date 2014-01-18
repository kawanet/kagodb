/*! events.js */

/** This mixin provides
 * [on()]{@linkcode KagoDB#on},
 * [once()]{@linkcode KagoDB#once},
 * [off()]{@linkcode KagoDB#off} and
 * [emit()]{@linkcode KagoDB#emit} methods to fire and receive events.
 *
 * @class events
 * @mixin
 * @example
 * var collection = new KagoDB();
 *
 * collection.on('hello', function(data) {
 *   console.log('Hello,', data);
 * });
 *
 * collection.emit('hello', 'world!'); // => 'hello, world!'
 */

module.exports = function() {
  var mixin = {};
  mixin.on = on;
  mixin.off = off;
  mixin.once = once;
  mixin.emit = emit;
  return mixin;
};

/**
 * This adds a listener to the end of the listeners array for the specified event.
 *
 * @method KagoDB.prototype.on
 * @param {String} event - event name
 * @param {Function} listener - listner function
 * @returns this class itself for method chaining
 * @see http://nodejs.org/api/events.html#events_emitter_on_event_listener
 */

function on(event, listener) {
  var ev = this._events || (this._events = {});
  var array = ev[event] || (ev[event] = []);
  array.push(listener);
  return this;
}

/**
 * This removes listeners.
 *
 * @method KagoDB.prototype.off
 * @param {String} [event] - event name
 * @param {Function} [listener] - listner function
 * @returns this class itself for method chaining
 */

function off(event, listener) {
  var ev = this._events;
  var array;
  if (!ev) {
    // no events registered
    return this;
  } else if (!event) {
    // remove all events
    delete this._events;
    return this;
  }

  array = ev[event];
  if (!array) {
    // no listener registered on this event
    return this;
  } else if (!listener) {
    // remove all listeners on this event
    delete ev[event];
    return this;
  }

  // remove the specified listener on this event
  ev[event] = array.filter(function(test) {
    return listener != test;
  });
  return this;
}

/**
 * This adds a one time listener for the event.
 * This listener is invoked only the next time the event is fired, after which it is removed.
 *
 * @method KagoDB.prototype.once
 * @param {String} event - event name
 * @param {Function} listener - listner function
 * @returns this class itself for method chaining
 * @see http://nodejs.org/api/events.html#events_emitter_once_event_listener
 */

function once(event, listener) {
  var self = this;
  var wrap = function() {
    if (wrap.done) return;
    self.off(event, listener);
    listener.apply(this, arguments);
    wrap.done = true;
  };
  this.on(event, wrap);
  return this;
}

/**
 * This fires an event with the supplied arguments. It executes each of the listeners in order.
 *
 * @method KagoDB.prototype.emit
 * @param {String} event - event name
 * @param args... - multiple arguments allowed.
 * @returns this class itself for method chaining
 * @see http://nodejs.org/api/events.html#events_emitter_emit_event_arg1_arg2
 */

function emit(event) {
  var self = this;
  var ev = this._events;
  var array, args;
  if (!ev) {
    // no events registered
    return;
  }

  array = ev[event];
  if (!array) {
    // no listener registered on this event
    return;
  }

  args = Array.prototype.slice.call(arguments);
  args.shift();
  array.forEach(function(listener) {
    listener.apply(self, args);
  });
  return this;
}