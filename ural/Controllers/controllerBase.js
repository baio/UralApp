(function() {

  define(["Ural/Modules/ODataProvider", "Ural/Modules/WebSqlProvider"], function(odataProvider, webSqlProvider) {
    var ControllerBase;
    ControllerBase = (function() {

      function ControllerBase(modelName) {
        this.modelName = modelName;
        if (this.modelName == null) this.modelName = this._getControllerName();
        this._dataProviders = _u.toHashTable(this.onCreateDataProviders());
        this.defaultDataProviderName = _u.firstKey(this._dataProviders);
      }

      ControllerBase.prototype.onCreateDataProviders = function() {
        return [
          {
            name: "odata",
            provider: odataProvider.dataProvider
          }, {
            name: "websql",
            provider: webSqlProvider.dataProvider
          }
        ];
      };

      ControllerBase.prototype.getDataProvider = function(name) {
        if (name == null) name = this.defaultDataProviderName;
        return this._dataProviders[name];
      };

      ControllerBase.prototype.index = function(filter, onDone) {
        var _this = this;
        return this.getDataProvider().load(this.modelName, filter, function(err, data) {
          return _this.view(data, "index", null, onDone);
        });
      };

      ControllerBase.prototype.details = function(id) {};

      ControllerBase.prototype.edit = function(id) {};

      ControllerBase.prototype.view = function(model, viewPath, layoutViewPath, onDone) {
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
            ko.applyBindings(model);
            return ck();
          }
        ], function(err) {
          if (onDone) return onDone(err);
        });
      };

      ControllerBase.prototype._prepareViewPath = function(path, defPath) {
        var controllerName;
        if (path == null) path = defPath;
        if (path) {
          if (!path.match(/.*\.htm[l]?/)) path += ".html";
          if (!path.match(/^Views\/.*/)) {
            if (!path.match(/.*\/.*/)) {
              controllerName = this._getControllerName();
              return "Views/" + controllerName + "/" + path;
            } else {
              return "Views/" + path;
            }
          } else {
            return path;
          }
        }
      };

      ControllerBase.prototype._getControllerName = function() {
        return _u.getClassName(this).replace(/^(\w*)Controller$/, "$1");
      };

      return ControllerBase;

    })();
    return {
      ControllerBase: ControllerBase
    };
  });

}).call(this);
