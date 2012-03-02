(function() {

  define(function() {
    var ControllerBase;
    ControllerBase = (function() {

      function ControllerBase() {}

      ControllerBase.prototype.construcor = function() {
        return this.dataProvider = this.onCreateDataProvider();
      };

      ControllerBase.prototype.onCreateDataProvider = function() {
        return this.dataProvider = require("Ural/Modules/ODataProvider");
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
        if (path == null) path = defPath;
        if (path) {
          if (!path.match(/.*\.htm[l]?/)) path += ".html";
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
