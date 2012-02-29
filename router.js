(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["ural/routerBase"], function(routerBase) {
    var Router;
    Router = (function(_super) {

      __extends(Router, _super);

      function Router() {
        Router.__super__.constructor.call(this, "Controllers", "Product/Index");
      }

      return Router;

    })(routerBase.RouterBase);
    return {
      Router: Router
    };
  });

}).call(this);
