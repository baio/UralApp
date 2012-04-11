(function() {

  define(function() {
    var RouterBase;
    RouterBase = (function() {

      function RouterBase(controllerDirectory, defaultRoute) {
        this.controllerDirectory = controllerDirectory;
        this.defaultRoute = defaultRoute;
        this.currentHash = "";
      }

      RouterBase.prototype.startRouting = function(onRouteChangedCallback) {
        var _this = this;
        this.onRouteChangedCallback = onRouteChangedCallback;
        window.location.hash = window.location.hash || this.defaultRoute;
        return setInterval((function() {
          return _this.hashCheck();
        }), 100);
      };

      RouterBase.prototype.hashCheck = function() {
        if (window.location.hash !== this.currentHash) {
          this.currentHash = window.location.hash;
          return this.refresh();
        }
      };

      RouterBase.prototype.refresh = function() {
        var action, capControllerName, controller, controllerName, index, match, regexp,
          _this = this;
        regexp = new RegExp("#/?(\\w+)/(\\w+)/?(\\w+)?");
        match = this.currentHash.match(regexp);
        controller = match[1];
        action = match[2];
        index = match[3];
        controllerName = "" + controller + "Controller";
        capControllerName = "" + (_.str.capitalize(controller)) + "Controller";
        return require(["" + this.controllerDirectory + "/" + controllerName], function(controllerModule) {
          eval("new controllerModule." + capControllerName + "()." + action + "(" + index + ")");
          return _this.onRouteChanged(controller, action);
        });
      };

      RouterBase.prototype.onRouteChanged = function(controller, action) {
        if (this.onRouteChangedCallback) {
          return this.onRouteChangedCallback(controller, action);
        }
      };

      return RouterBase;

    })();
    return {
      RouterBase: RouterBase
    };
  });

}).call(this);
