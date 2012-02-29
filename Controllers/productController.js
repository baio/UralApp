(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["Ural/Controllers/controllerBase"], function(controllerBase) {
    var ProductController;
    ProductController = (function(_super) {

      __extends(ProductController, _super);

      function ProductController() {
        ProductController.__super__.constructor.call(this);
      }

      return ProductController;

    })(controllerBase.ControllerBase);
    return {
      ProductController: ProductController
    };
  });

}).call(this);
