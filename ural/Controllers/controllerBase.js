(function() {
  define(function() {
    var ControllerBase;
    ControllerBase = (function() {
      function ControllerBase() {
        this._dataProviders = _u.toHashTable(this.onCreateDataProviders());
        this.defaultDataProviderName = _u.firstKey(this._dataProviders);
      }
      ControllerBase.prototype.onCreateDataProviders = function() {
        var odataProvider, webSqlProvider;
        odataProvider = require(["Ural/Modules/ODataProvider"]);
        webSqlProvider = require(["Ural/Modules/WebSqlProvider"]);
        return [
          {
            name: "odata",
            provider: odataProvider
          }, {
            name: "websql",
            provider: webSqlProvider
          }
        ];
      };
      ControllerBase.prototype.getDataProvider = function(name) {
                if (name != null) {
          name;
        } else {
          name = this.defaultDataProviderName;
        };
        return this._dataProviders[name];
      };
      ControllerBase.prototype.index = function() {
        return this.view(null, "index");
      };
      ControllerBase.prototype.details = function(id) {};
      ControllerBase.prototype.edit = function(id) {};
      ControllerBase.prototype.view = function(model, viewPath, layoutViewPath) {
        var bvp, lvp;
        lvp = this._prepareViewPath(layoutViewPath, "Shared/_layout");
        bvp = this._prepareViewPath(viewPath);
        return async.waterfall([
          function(ck) {
            return require(["Ural/text!" + lvp], function(layoutHtml) {
              return ck(null, layoutHtml);
            });
          }, function(layoutHtml, ck) {
            return require(["Ural/text!" + bvp], function(bodyHtml) {
              return ck(null, layoutHtml, bodyHtml);
            });
          }, function(layoutHtml, bodyHtml, ck) {
            $("#_layout").empty();
            $("#_layout").append(layoutHtml);
            $("#_body").append(bodyHtml);
            return ck();
          }
        ]);
      };
      ControllerBase.prototype._prepareViewPath = function(path, defPath) {
        var controllerName;
                if (path != null) {
          path;
        } else {
          path = defPath;
        };
        if (path) {
          if (!path.match(/.*\.htm[l]?/)) {
            path += ".html";
          }
          if (!path.match(/^Views\/.*/)) {
            if (!path.match(/.*\/.*/)) {
              controllerName = _u.getClassName(this).replace(/^(\w*)Controller$/, "$1");
              return "Views/" + controllerName + "/" + path;
            } else {
              return "Views/" + path;
            }
          } else {
            return path;
          }
        }
      };
      return ControllerBase;
    })();
    return {
      ControllerBase: ControllerBase
    };
  });
}).call(this);
