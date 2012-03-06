(function() {
  define(["Ural/Modules/WebSqlFilter"], function(fr) {
    var WebSqlProvider;
    WebSqlProvider = (function() {
      function WebSqlProvider() {}
      WebSqlProvider.prototype.load = function(srcName, filter, callback) {};
      WebSqlProvider.prototype._getStatement = function(srcName, filter) {
        return this._getSatementByWebSqlFilter(srcName, fr.convert(filter));
      };
      WebSqlProvider.prototype._getSatementByWebSqlFilter = function(srcName, webSqlFilter) {
        var res;
        res = "SELECT * FROM " + srcName;
        if (webSqlFilter) {
          if (webSqlFilter.$filter) {
            res += " WHERE " + webSqlFilter.$filter;
          }
          if (webSqlFilter.$top) {
            res += " LIMIT " + webSqlFilter.$top;
          }
          if (webSqlFilter.$skip) {
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
