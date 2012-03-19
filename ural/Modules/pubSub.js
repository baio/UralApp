(function() {

  define(["Ural/Libs/amplify"], function() {
    var pub, sub;
    pub = function(cat, name, data, callback) {
      if (callback) data.__pubCallback = callback;
      return amplify.publish("" + cat + "." + name, data);
    };
    sub = function(cat, name, callback) {
      return amplify.subscribe("" + cat + "." + name, function(data) {
        var pubCallback;
        pubCallback = data.__pubCallback;
        data.__callback = void 0;
        return callback(data, name, pubCallback);
      });
    };
    return {
      pub: pub,
      sub: sub
    };
  });

}).call(this);
