(function() {
  var Utils;

  Utils = (function() {

    function Utils() {}

    Utils.prototype.getClassName = function(obj) {
      if (typeof obj !== "object" || obj === null) return false;
      return /(\w+)\(/.exec(obj.constructor.toString())[1];
    };

    return Utils;

  })();

  this._u = new Utils();

}).call(this);
