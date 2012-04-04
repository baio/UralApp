(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["Ural/routerBase"], function(routerBase) {
    var Router;
    Router = (function(_super) {

      __extends(Router, _super);

      function Router() {
        Router.__super__.constructor.call(this, "Controllers", "product/index");
      }

      Router.prototype.onRouteChanged = function(controller, action) {
        $(".navbar .nav li .active").toggleClass("active");
        $(".navbar .nav a[href='#" + controller + "/" + action + "']").parent().toggleClass("active");
        return Router.__super__.onRouteChanged.call(this, controller, action);
      };

      return Router;

    })(routerBase.RouterBase);
    return {
      Router: Router
    };
  });

}).call(this);
