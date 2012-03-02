(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  describe("data test", function() {
    describe("convert framework filter to OData filter expression", function() {
      var filter;
      filter = null;
      beforeEach(function() {
        runs(function() {
          return require(["Ural/Modules/ODataFilter"], function(fr) {
            return filter = fr;
          });
        });
        return waits(500);
      });
      it("very simple filter: id = 1", function() {
        return runs(function() {
          var actual, expected, frameworkFilter;
          expect(filter).toBeTruthy();
          frameworkFilter = {
            id: {
              $eq: "1"
            }
          };
          actual = filter.convert(frameworkFilter);
          expected = {
            $filter: "id eq 1"
          };
          expect(actual.$filter).toBe(expected.$filter);
          expect(actual.$skip).toBe(expected.$skip);
          return expect(actual.$top).toBe(expected.$top);
        });
      });
      return it("filter - id in (...) and name like (...)", function() {
        return runs(function() {
          var actual, expected, frameworkFilter;
          frameworkFilter = {
            $page: 1,
            $itemsPerPage: 10,
            id: {
              $in: [0, 1, 5]
            },
            name: {
              $like: "o"
            }
          };
          actual = filter.convert(frameworkFilter);
          expected = {
            $filter: "(id eq 0 or id eq 1 or id eq 5) and indexOf(name, 'o') != -1",
            $skip: 10,
            $top: 10
          };
          expect(actual.$filter).toBe(expected.$filter);
          expect(actual.$skip).toBe(expected.$skip);
          return expect(actual.$top).toBe(expected.$top);
        });
      });
    });
    describe("convert framework filter to WebSql filter expression", function() {
      var filter;
      filter = null;
      beforeEach(function() {
        runs(function() {
          return require(["Ural/Modules/WebSqlFilter"], function(fr) {
            return filter = fr;
          });
        });
        return waits(500);
      });
      it("very simple filter: id = 1", function() {
        return runs(function() {
          var actual, expected, frameworkFilter;
          expect(filter).toBeTruthy();
          frameworkFilter = {
            id: {
              $eq: "1"
            }
          };
          actual = filter.convert(frameworkFilter);
          expected = {
            $filter: "id = 1"
          };
          expect(actual.$filter).toBe(expected.$filter);
          expect(actual.$skip).toBe(expected.$skip);
          return expect(actual.$top).toBe(expected.$top);
        });
      });
      return it("filter - id in (...) and name like (...)", function() {
        return runs(function() {
          var actual, expected, frameworkFilter;
          frameworkFilter = {
            $page: 1,
            $itemsPerPage: 10,
            id: {
              $in: [0, 1, 5]
            },
            name: {
              $like: "o"
            }
          };
          actual = filter.convert(frameworkFilter);
          expected = {
            $filter: "id IN (0,1,5) AND name LIKE 'o'",
            $skip: 10,
            $top: 10
          };
          expect(actual.$filter).toBe(expected.$filter);
          expect(actual.$skip).toBe(expected.$skip);
          return expect(actual.$top).toBe(expected.$top);
        });
      });
    });
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
        TestController = (function(_super) {

          __extends(TestController, _super);

          function TestController() {
            TestController.__super__.constructor.apply(this, arguments);
          }

          return TestController;

        })(controllerBase.ControllerBase);
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
        TestController = (function(_super) {

          __extends(TestController, _super);

          function TestController() {
            TestController.__super__.constructor.apply(this, arguments);
          }

          return TestController;

        })(controllerBase.ControllerBase);
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
