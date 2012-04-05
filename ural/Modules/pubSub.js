(function() {

  define(["Ural/Libs/amplify"], function() {
    var pub, sub, subOnce, _subOnceList;
    _subOnceList = [];
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
    subOnce = function(cat, name, tag, callback) {
      var qualifyName, recentCallback;
      qualifyName = "" + cat + "." + name + "." + tag;
      recentCallback = _subOnceList[qualifyName];
      if (recentCallback) {
        amplify.unsubscribe("" + cat + "." + name, recentCallback);
      }
      return _subOnceList[qualifyName] = sub(cat, name, callback);
    };
    return {
      pub: pub,
      sub: sub,
      subOnce: subOnce
    };
  });

}).call(this);
