(function() {
  var Utils,
    __hasProp = Object.prototype.hasOwnProperty;

  Utils = (function() {

    function Utils() {}

    Utils.prototype.getClassName = function(obj) {
      if (typeof obj !== "object" || obj === null) return false;
      return /(\w+)\(/.exec(obj.constructor.toString())[1];
    };

    Utils.prototype.toHashTable = function(array) {
      var i, _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        i = array[_i];
        hashtable[getKey(i, 0)] = hashtable[getKey(i, 1)];
      }
      return hashtable;
    };

    Utils.prototype.getKey = function(hashtable, index) {
      var cnt, key;
      cnt = 0;
      for (key in hashtable) {
        if (!__hasProp.call(hashtable, key)) continue;
        if (cnt === index) return key;
        cnt++;
      }
      return null;
    };

    Utils.prototype.firstKey = function(hashtable) {
      return getKey(hashtable, 0);
    };

    Utils.prototype.first = function(hashtable) {
      return hashtable[firstKey(hashtable)];
    };

    return Utils;

  })();

  this._u = new Utils();

}).call(this);
