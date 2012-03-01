(function() {

  define(function() {
    var ControllerBase;
    ControllerBase = (function() {

      function ControllerBase() {}

      ControllerBase.prototype.index = function() {
        return this.view("Index");
      };

      ControllerBase.prototype.details = function(id) {};

      ControllerBase.prototype.edit = function(id) {};

      ControllerBase.prototype.view = function(model, viewPath, layoutViewPath) {
        var bvp, lvp;
        lvp = this._prepareViewPath(layoutViewPath, "Shared/_layout");
        bvp = this._prepareViewPath(viewPath);
        /*
              layoutHtml = require ["Ural/text!#{lvp}"]
              if layoutHtml
                bodyHtml = require ["Ural/text!#{bvp}"]
                if !bodyHtml
                  $("#_layout").empty()
                  $("#_layout").append layoutHtml
                  $("#_body").append bodyHtml
        */
        return async.waterfall([
          function(ck) {
            return require(["Ural/text!" + lvp], function(layoutHtml, err) {
              return ck(null, layoutHtml);
            });
          }, function(layoutHtml, ck) {
            return require(["Ural/text!" + bvp], function(bodyHtml, err) {
              return ck(null, layoutHtml, bodyHtml);
            });
          }, function(layoutHtml, bodyHtml, ck) {
            $("#_layout").empty();
            $("#_layout").append(layoutHtml);
            $("#_body").append(bodyHtml);
            return ck();
          }
        ]);
        /*
              if !layoutHtml
                throw "Layout view not found on path #{lvp.toString()}"
              if !bodyHtml
                throw "Body view not found on path #{bvp.toString()}"
        */
        /*
              layoutViewPaths = @_prepareViewPaths layoutViewPath, "_layout"
              bodyViewPaths = @_prepareViewPaths viewPath
              require ["Ural/text!Views/Shared/_layout1.html"], (html) ->
                console.log html
        
              for lvp in layoutViewPaths
                try
                  layoutHtml = require "Ural/text!#{lvp}"
                catch ex
                if !layoutHtml
                  for bvp in bodyViewPaths
                    bodyHtml = require ["Ural/text!#{bvp}"]
                    if !bodyHtml
                      $("#_layout").empty()
                      $("#_layout").append layoutHtml
                      $("#_body").append bodyHtml
                      return
              if !layoutHtml
                #throw "Layout view not found on paths #{layoutViewPaths.toString()}"
              if !bodyHtml
                #throw "Body view not found on paths #{bodyViewPaths.toString()}"
              async.mapSeries layoutViewPaths
                ,(i, ck) -> require ["Ural/text!#{i}"], (html) -> ck html
                ,(layoutHtml) ->
                  if !layoutHtml then throw "Layout view not found on paths : #{layoutViewPaths.toString()}"
                  async.mapSeries bodyViewPaths
                    ,(i, ck) -> require ["Ural/text!#{i}"], (html) -> ck html
                    ,(bodyHtml) ->
                      if !bodyHtml then throw "Body view not found on paths : #{bodyViewPaths.toString()}"
                      $("#_layout").empty()
                      $("#_layout").append layoutHtml
                      $("#_body").append bodyHtml
        */
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
              return ["Views/" + path];
            }
          } else {
            return [path];
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
