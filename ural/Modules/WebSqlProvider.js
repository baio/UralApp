(function() {
  define(["Ural/Modules/WebSqlFilter"], function(filter) {
    var WebSqlProvider;
    WebSqlProvider = (function() {
      function WebSqlProvider() {}
      WebSqlProvider.prototype.load = function(srcName, filter, callback) {
        var f;
        return f = filter.convert(filter);
      };
      WebSqlProvider.prototype._getSatement = function(srcName, webSqlFilter) {
        var res;
        res = "SELECT * FROM " + srcName;
        if (webSqlFilter) {
          if (webSqlFilter.$filter) {
            res += " WHERE " + webSqlFilter.$filter;
          }
          if (webSqlFilter.$skip) {
            res += " LIMIT " + webSqlFilter.$top;
          }
          if (webSqlFilter.$filter) {
            res += " OFFSET " + webSqlFilter.$skip;
          }
        }
        return res;
      };
      return WebSqlProvider;
    })();
    return {
      dataProvider: new WebSqlProvider()
    };
  });
}).call(this);
