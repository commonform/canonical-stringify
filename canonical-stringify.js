(function() {
  'use strict';
  var ESCAPABLE, META, gap, indent, quote, rep, str, stringify;

  ESCAPABLE = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  gap = null;

  indent = null;

  META = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"': '\\"',
    '\\': '\\\\'
  };

  rep = null;

  quote = function(string) {
    var val;
    ESCAPABLE.lastIndex = 0;
    if (ESCAPABLE.test(string)) {
      val = string.replace(ESCAPABLE, function(a) {
        var c;
        c = META[a];
        if (typeof c === 'string') {
          return c;
        } else {
          return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }
      });
      return '"' + val + '"';
    } else {
      return '"' + string + '"';
    }
  };

  str = function(key, holder) {
    var i, k, length, mind, partial, sortedKeys, v, value, _i, _j, _k, _len, _len1, _ref, _results;
    mind = gap;
    value = holder[key];
    if (typeof rep === 'function') {
      value = rep.call(holder, key, value);
    }
    switch (typeof value) {
      case 'string':
        return quote(value);
      case 'number':
        if (isFinite(value)) {
          return String(value);
        } else {
          return 'null';
        }
        break;
      case 'boolean':
      case 'null':
        return String(value);
      case 'object':
        if (!value) {
          return 'null';
        }
        gap += indent;
        partial = [];
        if (Object.prototype.toString.apply(value) === '[object Array]') {
          length = value.length;
          for (i = _i = 0, _ref = value.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            partial[i] = str(i, value) || 'null';
          }
          if (partial.length === 0) {
            v = '[]';
          } else {
            if (gap) {
              v = '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']';
            } else {
              v = '[' + partial.join(',') + ']';
            }
          }
          gap = mind;
          return v;
          if (rep && typeof rep === 'object') {
            length = rep.length;
            _results = [];
            for (_j = 0, _len = rep.length; _j < _len; _j++) {
              k = rep[_j];
              if (typeof k === 'string') {
                v = str(k, value);
                if (v) {
                  _results.push(partial.push(quote(k) + (gap ? ': ' : ':') + v));
                } else {
                  _results.push(void 0);
                }
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        } else {
          sortedKeys = Object.keys(value).sort();
          for (_k = 0, _len1 = sortedKeys.length; _k < _len1; _k++) {
            k = sortedKeys[_k];
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
          if (partial.length === 0) {
            v = '{}';
          } else {
            if (gap) {
              v = '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}';
            } else {
              v = '{' + partial.join(',') + '}';
            }
          }
          gap = mind;
          return v;
        }
    }
  };

  stringify = function(value, replacer, space) {
    var i, replacerType, _i, _ref;
    gap = '';
    indent = '';
    if (typeof space === 'number') {
      for (i = _i = 0, _ref = space(-1); 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        indent += ' ';
      }
    } else if (typeof space === 'string') {
      indent = space;
    }
    rep = replacer;
    replacerType = typeof replacer;
    if (replacer && replacerType !== 'function' && (replacerType !== 'object' || typeof replacer.length !== 'number')) {
      throw new Error('JSON.stringify');
    }
    return str('', {
      '': value
    });
  };

  if ((typeof module !== "undefined" && module !== null) && (module.exports != null)) {
    module.exports = stringify;
  } else {
    this.canonicalStringify = stringify;
  }

}).call(this);

//# sourceMappingURL=.././canonical-stringify.js.map
