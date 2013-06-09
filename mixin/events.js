/*! events.js */

/** This mixin provides on(), once(), off() and emit() methods to fire and receive events.
 * @class EventsMixin
 * @mixin
 */

module.exports = function() {
  var mixin = {};
  mixin.on = on;
  mixin.off = off;
  mixin.once = once;
  mixin.emit = emit;
  return mixin;
};

/** This adds a listener to the end of the listeners array for the specified event.
 * @method EventsMixin.prototype.on
 * @param {String} event - event name
 * @param {Function} listener - listner function
 * @see http://nodejs.org/api/events.html#events_emitter_on_event_listener
 */

function on(event, listener) {
  var ev = this._events || (this._events = {});
  var array = ev[event] || (ev[event] = []);
  array.push(listener);
}

/** This removes listeners.
 * @method EventsMixin.prototype.off
 * @param {String} [event] - event name
 * @param {Function} [listener] - listner function
 */

function off(event, listener) {
  var ev = this._events;
  var array;
  if (!ev) {
    // no events registered
    return;
  } else if (!event) {
    // remove all events
    delete this._events;
    return;
  }

  array = ev[event];
  if (!array) {
    // no listener registered on this event
    return;
  } else if (!listener) {
    // remove all listeners on this event
    delete ev[event];
    return;
  }

  // remove the specified listener on this event
  ev[event] = array.filter(function(test) {
    return listener != test;
  });
}

/** This adds a one time listener for the event.
 * This listener is invoked only the next time the event is fired, after which it is removed.
 * @method EventsMixin.prototype.once
 * @param {String} event - event name
 * @param {Function} listener - listner function
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
}

/** This fires an event with the supplied arguments. It executes each of the listeners in order.
 * @method EventsMixin.prototype.emit
 * @param {String} event - event name
 * @param args... - multiple arguments allowed.
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
}