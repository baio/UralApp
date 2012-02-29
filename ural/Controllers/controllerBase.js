(function() {

  define(function() {
    var ControllerBase;
    ControllerBase = (function() {

      function ControllerBase() {
        this.viewDir = _u.getClassName(this);
      }

      ControllerBase.prototype.index = function() {
        return this.view(null, "Views/Shared/_index");
      };

      ControllerBase.prototype.details = function(id) {};

      ControllerBase.prototype.edit = function(id) {};

      ControllerBase.prototype.view = function(model, viewPath, layoutViewPath) {
        viewPath = this._prepareViewPath(viewPath);
        layoutViewPath = this._prepareViewPath(layoutViewPath, "Views/Shared/_layout");
        return require(["Ural/text!" + layoutViewPath], function(html) {
          $("#_layout").empty();
          $("#_layout").append(html);
          return require(["Ural/text!" + viewPath], function(html) {
            return $("#_body").append(html);
          });
        });
      };

      ControllerBase.prototype._prepareViewPath = function(path, defPath) {
        if (path == null) path = defPath;
        if (!path.match(/.*\.htm[l]?/)) return path += ".html";
      };

      return ControllerBase;

    })();
    return {
      ControllerBase: ControllerBase
    };
  });

}).call(this);
