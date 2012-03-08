(function() {
  define(["Ural/Modules/WebSqlFilter"], function(fr) {
    var WebSqlProvider;
    WebSqlProvider = (function() {
      function WebSqlProvider() {}
      WebSqlProvider.dbName = function() {
        return 'UralApp';
      };
      WebSqlProvider.prototype.load = function(srcName, filter, callback) {
        var db, stt;
        stt = this._getStatement(srcName, filter);
        console.log(stt);
        db = openDatabase(WebSqlProvider.dbName(), '1.0', 'spec database', 2 * 1024 * 1024);
        return db.transaction(function(tx) {
          var res;
          res = [];
          return tx.executeSql(stt, [], function(tx, results) {
            var i, _ref;
            for (i = 0, _ref = results.rows.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              res.push(results.rows.item(i));
            }
            return callback(res);
          });
        });
      };
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
