(function() {

  define(["Ural/Libs/amplify"], function() {
    var pub, sub;
    pub = function(cat, name, data) {
      return amplify.publish("" + cat + "." + name, data);
    };
    sub = function(cat, name, callback) {
      return amplify.subscribe("" + cat + "." + name, callback);
    };
    return {
      pub: pub,
      sub: sub
    };
  });

}).call(this);
