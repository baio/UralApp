(function() {

  define(function() {
    var WebSqlProvider;
    WebSqlProvider = (function() {

      function WebSqlProvider() {}

      WebSqlProvider.prototype.load = function(filter, callback) {};

      return WebSqlProvider;

    })();
    return {
      dataProvider: new WebSqlProvider()
    };
  });

}).call(this);
