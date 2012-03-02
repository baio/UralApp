(function() {

  define(function() {
    var ODataProvider;
    ODataProvider = (function() {

      function ODataProvider() {}

      ODataProvider.prototype.load = function(filter, callback) {};

      return ODataProvider;

    })();
    return {
      dataProvider: new ODataProvider()
    };
  });

}).call(this);
