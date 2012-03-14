(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["Controllers/productController", "Ural/Controllers/controllerBase"], function(productController, controllerBase) {
    describe("play with index views, load model then show view", function() {
      afterEach(function() {});
      it("indexCustom", function() {
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
      it("indexCustom with custom model", function() {
        var controller, err;
        controller = new productController.ProductController();
        err = null;
        runs(function() {
          return controller.indexCustomWithCustomModel(function(e) {
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          expect($("table#model_container td:eq(0)").text()).toBe("0");
          expect($("table#model_container td:eq(1)").text()).toBe("zerofoo");
          expect($("table#model_container td:eq(2)").text()).toBe("0 zerofoo");
          expect($("table#model_container td:eq(15)").text()).toBe("5");
          expect($("table#model_container td:eq(16)").text()).toBe("fivefoo");
          return expect($("table#model_container td:eq(17)").text()).toBe("5 fivefoo");
        });
      });
      it("index, ini model name explicitly via constructor", function() {
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
      it("index, ini model name implicitly via class name", function() {
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
      return it("model name impilcitily, create custom model (path to module implicitily) via options", function() {
        var controller, err;
        controller = new productController.ProductController({
          model: {
            useCustomModel: true
          }
        });
        err = null;
        runs(function() {
          return controller.index(function(e) {
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          expect($("table#model_container td:eq(0)").text()).toBe("0");
          expect($("table#model_container td:eq(1)").text()).toBe("zerofoo");
          expect($("table#model_container td:eq(2)").text()).toBe("0 zerofoo");
          expect($("table#model_container td:eq(15)").text()).toBe("5");
          expect($("table#model_container td:eq(16)").text()).toBe("fivefoo");
          return expect($("table#model_container td:eq(17)").text()).toBe("5 fivefoo");
        });
      });
    });
    return describe("edit index view's items", function() {
      var viewModel;
      viewModel = null;
      beforeEach(function() {
        var controller;
        controller = new productController.ProductController({
          model: {
            useCustomModel: true
          }
        });
        runs(function() {
          return controller.index(null, function(err, vm) {
            return viewModel = vm;
          });
        });
        waits(500);
        return runs(function() {
          return $("table#model_container tr:eq(0)").click();
        });
      });
      afterEach(function() {
        viewModel = null;
        return $("#_body").empty();
      });
      it("show edit for first item", function() {
        expect($("[data-form-model-type='Product'][data-form-type='edit']").is(":visible")).toBe(true);
        return expect($("#product_name").val()).toBe('zerofoo');
      });
      return it("show edit for first item, then edit name, then cancel", function() {
        expect(viewModel.active().item.name()).toBe("zerofoo");
        $("#product_name").val("test");
        return expect(viewModel.list[0].item.name()).toBe("zerofoo");
      });
    });
  });

}).call(this);
