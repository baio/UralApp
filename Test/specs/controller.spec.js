(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  describe("ControllerBase test", function() {
    it("view paths should be baked in the right way", function() {
      var controllerBase;
      controllerBase = null;
      runs(function() {
        return require(["Ural/Controllers/controllerBase"], function(cb) {
          return controllerBase = cb;
        });
      });
      waits(500);
      return runs(function() {
        var TestController, controller, path;
        expect(controllerBase).toBeTruthy();
        TestController = (function(_super) {

          __extends(TestController, _super);

          function TestController() {
            TestController.__super__.constructor.apply(this, arguments);
          }

          return TestController;

        })(controllerBase.ControllerBase);
        controller = new TestController();
        path = controller._prepareViewPath(null, "Shared/Index");
        expect(path).toBe("Views/Shared/Index.html");
        path = controller._prepareViewPath(null, "Views/Shared/Index");
        expect(path).toBe("Views/Shared/Index.html");
        path = controller._prepareViewPath(null, "Index");
        return expect(path).toBe("Views/Test/Index.html");
      });
    });
    return it("load views (without model)", function() {
      var controllerBase;
      controllerBase = null;
      runs(function() {
        return require(["Ural/Controllers/controllerBase"], function(cb) {
          return controllerBase = cb;
        });
      });
      waits(500);
      runs(function() {
        var TestController, controller;
        expect(controllerBase).toBeTruthy();
        TestController = (function(_super) {

          __extends(TestController, _super);

          function TestController() {
            TestController.__super__.constructor.apply(this, arguments);
          }

          return TestController;

        })(controllerBase.ControllerBase);
        controller = new TestController();
        return controller.view(null, "Index");
      });
      waits(500);
      return runs(function() {
        return expect($("#_body").text().trim()).toEqual("_body");
      });
    });
  });

}).call(this);
