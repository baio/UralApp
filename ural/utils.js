(function() {
  var Utils,
    __hasProp = Object.prototype.hasOwnProperty;

  Utils = (function() {

    function Utils() {}

    Utils.prototype.getClassName = function(obj) {
      if (typeof obj !== "object" || obj === null) return false;
      return /(\w+)\(/.exec(obj.constructor.toString())[1];
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
      return this.getKey(hashtable, 0);
    };

    Utils.prototype.first = function(hashtable) {
      return hashtable[this.firstKey(hashtable)];
    };

    Utils.prototype.toHashTable = function(array) {
      var hashtable, i, _i, _len;
      hashtable = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        i = array[_i];
        hashtable[i[this.getKey(i, 0)]] = i[this.getKey(i, 1)];
      }
      return hashtable;
    };

    Utils.prototype.urlAddSearch = function(baseUrl, prms) {
      var i, url, _ref;
      url = arguments[0];
      if (!url) throw "baseUrl must be defined";
      for (i = 1, _ref = arguments.length - 1; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        if (arguments[i]) {
          if (url.indexOf("?") === -1) {
            url += "?";
          } else {
            url += "&";
          }
          url += arguments[i];
        }
      }
      return url;
    };

    return Utils;

  })();

  this._u = new Utils();

}).call(this);
