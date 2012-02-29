(function() {

  define(function() {
    var RouterBase;
    RouterBase = (function() {

      function RouterBase(controllerDirectory, defaultRoute) {
        this.controllerDirectory = controllerDirectory;
        this.defaultRoute = defaultRoute;
        this.currentHash = "";
        this.onRouteChanged = null;
      }

      RouterBase.prototype.startRouting = function(OnRouteChanged) {
        var _this = this;
        this.onRouteChanged = OnRouteChanged;
        window.location.hash = window.location.hash || this.defaultRoute;
        return setInterval((function() {
          return _this.hashCheck;
        }), 100);
      };

      RouterBase.prototype.hashCheck = function() {
        if (window.location.hash !== this.currentHash) {
          this.currentHash = window.location.hash;
          this.refresh();
          if (this.onRouteChanged) return this.onRouteChanged(this.currentHash);
        }
      };

      RouterBase.prototype.refresh = function() {
        var actionName, controllerName, index, match, regexp;
        regexp = new RegExp("#/(\\w+)/(\\w+)/?(\\w+)?");
        match = currentHash.match(regexp);
        controllerName = match[1];
        actionName = match[2];
        index = match[3];
        controllerName = "" + controllerName + "Controller";
        return require(["" + this.controllerDirectory + "/" + controllerName], function(controller) {
          return eval("new controller." + controllerName + "()." + actionName + "(" + index + ")");
        });
      };

      return RouterBase;

    })();
    return {
      RouterBase: RouterBase
    };
  });

}).call(this);
