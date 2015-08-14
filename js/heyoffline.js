//heyoffline.js
// Generated by CoffeeScript 1.4.0
var Heyoffline, addEvent, destroy, extend, setStyles,
  __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };

extend = function(destination, source) {
  var property;
  if (source) {
    for (property in source) {
      if (source[property] && source[property].constructor && source[property].constructor === Object) {
        destination[property] = destination[property] || {};
        arguments.callee(destination[property], source[property]);
      } else {
        destination[property] = source[property];
      }
    }
  }
  return destination;
};

addEvent = function(element, event, fn, useCapture) {
  if (useCapture == null) {
    useCapture = false;
  }
  return element.addEventListener(event, fn, useCapture);
};

setStyles = function(element, styles) {
  var key, _results;
  _results = [];
  for (key in styles) {
    _results.push(element.style[key] = styles[key]);
  }
  return _results;
};

destroy = function(element) {
  return element.parentNode.removeChild(element);
};

Heyoffline = (function() {

  Heyoffline.prototype.version = '1.1';

  Heyoffline.prototype.options = {
    text: {
      title: "You're currently offline",
      content: "Seems like you've gone offline,                you might want to wait until your network comes back before continuing.<br /><br />                This message will self-destruct once you're online again.",
      button: "Relax, I know what I'm doing"
    },
    monitorFields: false,
    prefix: 'heyoffline',
    noStyles: false,
    disableDismiss: false,
    elements: ['input', 'select', 'textarea', '*[contenteditable]']
  };

  Heyoffline.prototype.modified = false;

  function Heyoffline(options) {
    this.hideMessage = __bind(this.hideMessage, this);

    this.offline = __bind(this.offline, this);

    this.online = __bind(this.online, this);
    extend(this.options, options);
    this.setup();
  }

  Heyoffline.prototype.setup = function() {
    this.events = {
      element: ['keyup', 'change'],
      network: ['online', 'offline']
    };
    this.elements = {
      fields: document.querySelectorAll(this.options.elements.join(',')),
      overlay: document.createElement('div'),
      modal: document.createElement('div'),
      heading: document.createElement('h2'),
      content: document.createElement('p'),
      button: document.createElement('a')
    };
    this.defaultStyles = {
      overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        background: 'rgba(0, 0, 0, 0.3)',
        zIndex: 500
      },
      modal: {
        padding: '15px',
        background: '#fff',
        boxShadow: '0 2px 30px rgba(0, 0, 0, 0.3)',
        width: '450px',
        margin: '0 auto',
        position: 'relative',
        top: '30%',
        color: '#444',
        borderRadius: '2px',
        zIndex: 600
      },
      heading: {
        fontSize: '1.7em',
        paddingBottom: '15px'
      },
      content: {
        paddingBottom: '15px'
      },
      button: {
        fontWeight: 'bold',
        cursor: 'pointer'
      }
    };
    return this.attachEvents();
  };

  Heyoffline.prototype.createElements = function() {
    this.createElement(document.body, 'overlay');
    this.resizeOverlay();
    this.createElement(this.elements.overlay, 'modal');
    this.createElement(this.elements.modal, 'heading', this.options.text.title);
    this.createElement(this.elements.modal, 'content', this.options.text.content);
    if (!this.options.disableDismiss) {
      this.createElement(this.elements.modal, 'button', this.options.text.button);
      return addEvent(this.elements.button, 'click', this.hideMessage);
    }
  };

  Heyoffline.prototype.createElement = function(context, element, text) {
    this.elements[element].setAttribute('class', "" + this.options.prefix + "_" + element);
    this.elements[element] = context.appendChild(this.elements[element]);
    if (text) {
      this.elements[element].innerHTML = text;
    }
    if (!this.options.noStyles) {
      return setStyles(this.elements[element], this.defaultStyles[element]);
    }
  };

  Heyoffline.prototype.resizeOverlay = function() {
    return setStyles(this.elements.overlay, {
      height: "" + window.innerHeight + "px"
    });
  };

  Heyoffline.prototype.destroyElements = function() {
    if (this.elements.overlay) {
      return destroy(this.elements.overlay);
    }
  };

  Heyoffline.prototype.attachEvents = function() {
    var event, field, _i, _j, _len, _len1, _ref, _ref1,
      _this = this;
    _ref = this.elements.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      this.elementEvents(field);
    }
    _ref1 = this.events.network;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      event = _ref1[_j];
      this.networkEvents(event);
    }
    return addEvent(window, 'resize', function() {
      return _this.resizeOverlay();
    });
  };

  Heyoffline.prototype.elementEvents = function(field) {
    var event, _i, _len, _ref, _results,
      _this = this;
    _ref = this.events.element;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      _results.push((function(event) {
        return addEvent(field, event, function() {
          return _this.modified = true;
        });
      })(event));
    }
    return _results;
  };

  Heyoffline.prototype.networkEvents = function(event) {
    return addEvent(window, event, this[event]);
  };

  Heyoffline.prototype.online = function(event) {
    return this.hideMessage();
  };

  Heyoffline.prototype.offline = function() {
    if (this.options.monitorFields) {
      if (this.modified) {
        return this.showMessage();
      }
    } else {
      return this.showMessage();
    }
  };

  Heyoffline.prototype.showMessage = function() {
    this.createElements();
    if (this.options.onOnline) {
      return this.options.onOnline.call(this);
    }
  };

  Heyoffline.prototype.hideMessage = function(event) {
    if (event) {
      event.preventDefault();
    }
    this.destroyElements();
    if (this.options.onOffline) {
      return this.options.onOffline.call(this);
    }
  };

  return Heyoffline;

})();