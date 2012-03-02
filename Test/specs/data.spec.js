(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  describe("load data via controller, by some filters", function() {
    it("load data via WebSqlProvider data provider", function() {
      var controllerBase, data;
      controllerBase = null;
      data = null;
      runs(function() {
        return require(["Ural/Controllers/controllerBase"], function(cb) {
          return controllerBase = cb;
        });
      });
      waits(500);
      return runs(function() {
        var TestController, controller;
        expect(controllerBase).toBeTruthy();
        TestController = (function() {
          __extends(TestController, controllerBase.ControllerBase);
          function TestController() {
            TestController.__super__.constructor.apply(this, arguments);
          }
          return TestController;
        })();
        controller = new TestController();
        expect(controller.defaultDataProviderName).toBe("odata");
        expect(controller.getDataProvider()).toBeTruthy();
        controller.defaultDataProviderName = "websql";
        return expect(controller.getDataProvider()).toBeTruthy();
      });
      /*
          waits 500
          runs ->
            expect(data.length).toBe 5
            expect(data[0].id).toBe 0
            expect(data[0].name).toBe "zero"
            expect(data[1].id).toBe 1
            expect(data[1].name).toBe "one"
            expect(data[4].id).toBe 4
            expect(data[4].name).toBe "four"
          */
    });
    return xit("load data (using controller) via default (OData) data provider", function() {
      var controllerBase, data;
      controllerBase = null;
      data = null;
      runs(function() {
        return require(["Ural/Controllers/controllerBase"], function(cb) {
          return controllerBase = cb;
        });
      });
      waits(500);
      runs(function() {
        var TestController, controller, dataProvider;
        expect(controllerBase).toBeDefined();
        TestController = (function() {
          __extends(TestController, controllerBase.ControllerBase);
          function TestController() {
            TestController.__super__.constructor.apply(this, arguments);
          }
          return TestController;
        })();
        controller = new TestController();
        dataProvider = controller.dataProvider;
        expect(dataProvider).toBeDefined();
        return dataProvider.load(null, function(d) {
          return data = d;
        });
      });
      waits(500);
      return runs(function() {
        expect(data.length).toBe(5);
        expect(data[0].id).toBe(0);
        expect(data[0].name).toBe("zero");
        expect(data[1].id).toBe(1);
        expect(data[1].name).toBe("one");
        expect(data[4].id).toBe(4);
        return expect(data[4].name).toBe("four");
      });
    });
  });
}).call(this);
