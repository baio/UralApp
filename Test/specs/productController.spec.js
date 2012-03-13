(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["Controllers/productController", "Ural/Controllers/controllerBase"], function(productController, controllerBase) {
    return describe("play with index views", function() {
      it("indexCustom, load model then show view", function() {
        var controller, err;
        controller = new productController.ProductController();
        err = null;
        runs(function() {
          return controller.indexCustom(function(e) {
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          expect($("table#model_container td:eq(0)").text()).toBe("0");
          expect($("table#model_container td:eq(1)").text()).toBe("zero");
          expect($("table#model_container td:eq(10)").text()).toBe("5");
          return expect($("table#model_container td:eq(11)").text()).toBe("five");
        });
      });
      it("index, ini model name explicitly via constructor, load model then show view", function() {
        var controller, err;
        controller = new productController.ProductController();
        err = null;
        runs(function() {
          return controller.index(function(e) {
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          expect($("table#model_container td:eq(2)").text()).toBe("1");
          expect($("table#model_container td:eq(3)").text()).toBe("one");
          expect($("table#model_container td:eq(10)").text()).toBe("5");
          return expect($("table#model_container td:eq(11)").text()).toBe("five");
        });
      });
      return it("index, ini model name implicitly via class name, load model then show view", function() {
        var ProductController, controller, err;
        ProductController = (function(_super) {

          __extends(ProductController, _super);

          function ProductController() {
            ProductController.__super__.constructor.apply(this, arguments);
          }

          return ProductController;

        })(controllerBase.ControllerBase);
        controller = new ProductController();
        err = null;
        runs(function() {
          return controller.index(function(e) {
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          expect($("table#model_container td:eq(2)").text()).toBe("1");
          expect($("table#model_container td:eq(3)").text()).toBe("one");
          expect($("table#model_container td:eq(10)").text()).toBe("5");
          return expect($("table#model_container td:eq(11)").text()).toBe("five");
        });
      });
    });
  });

}).call(this);
