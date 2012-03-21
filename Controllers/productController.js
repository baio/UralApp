(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["Ural/Controllers/controllerBase", "Ural/Models/indexVM", "Models/product"], function(controllerBase, indexVM, productModel) {
    var ProductController;
    ProductController = (function(_super) {

      __extends(ProductController, _super);

      function ProductController(opts) {
        ProductController.__super__.constructor.call(this, "Product", opts);
      }

      ProductController.prototype.indexCustom = function(onDone) {
        var _this = this;
        return this.getDataProvider().load("Product", {
          $expand: "$index"
        }, function(err, data) {
          _this.view(new indexVM.IndexVM(data), "index");
          if (onDone) return onDone(err);
        });
      };

      ProductController.prototype.indexCustomWithCustomModel = function(onDone) {
        var _this = this;
        return this.getDataProvider().load("Product", {
          $expand: "$index"
        }, function(err, data) {
          var model;
          model = data.map(function(d) {
            return ko.mapping.fromJS(d, productModel.mappingRules, new productModel.ModelConstructor());
          });
          _this.view(new indexVM.IndexVM(model), "index");
          if (onDone) return onDone(err);
        });
      };

      return ProductController;

    })(controllerBase.ControllerBase);
    return {
      ProductController: ProductController
    };
  });

}).call(this);
