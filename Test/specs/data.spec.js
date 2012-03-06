(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  beforeEach(function() {
    /*
      db = openDatabase 'test', '1.0', 'spec database', 2 * 1024 * 1024
      db.transaction (tx) ->
        tx.executeSql "CREATE TABLE IF NOT EXISTS Product (id unique, name)"
        tx.executeSql "INSERT INTO Product (id, name) VALUES (0, 'zero')"
        tx.executeSql "INSERT INTO Product (id, name) VALUES (1, 'one')"
        tx.executeSql "INSERT INTO Product (id, name) VALUES (2, 'two')"
        tx.executeSql "INSERT INTO Product (id, name) VALUES (3, 'free')"
        tx.executeSql "INSERT INTO Product (id, name) VALUES (4, 'four')"
      */
  });
  afterEach(function() {
    /*
      db = openDatabase 'test', '1.0', 'spec database', 2 * 1024 * 1024
      db.transaction (tx) ->
        tx.executeSql('DROP TABLE IF EXISTS Product');
      */
  });
  describe("WebSql provider statements", function() {
    var dataProvider;
    dataProvider = null;
    beforeEach(function() {
      runs(function() {
        return require(["Ural/Modules/WebSqlProvider"], function(dp) {
          return dataProvider = dp.dataProvider;
        });
      });
      return waits(500);
    });
    it("plain without any filter", function() {
      return runs(function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", null);
        return expect(actual).toBe("SELECT * FROM Product");
      });
    });
    it("id = 0", function() {
      return runs(function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          id: {
            $eq: 0
          }
        });
        return expect(actual).toBe("SELECT * FROM Product WHERE id = 0");
      });
    });
    it("id in (...)", function() {
      return runs(function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          id: {
            $in: [0, 1, 3]
          }
        });
        return expect(actual).toBe("SELECT * FROM Product WHERE id IN (0,1,3)");
      });
    });
    return it("id = 0 and name LIKE(...) OFFSET LIMIT", function() {
      return runs(function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          id: {
            $eq: 0
          },
          name: {
            $like: 'r'
          },
          $page: 5,
          $itemsPerPage: 7
        });
        return expect(actual).toBe("SELECT * FROM Product WHERE id = 0 AND name LIKE 'r' LIMIT 7 OFFSET 35");
        /*
                  actual = dataProvider._getSatement "Product", id : {$eq : 0 }
                  expect(actual).toBe "SELECT * FROM Product WHERE id = 0"
                  actual = dataProvider._getSatement "Product", id : {$in : [0,1,3] }, $page : 3
                  expect(actual).toBe "SELECT * FROM Product WHERE id IN (0,1,3)"
                  actual = dataProvider._getSatement "Product", id : { $eq : 0}, name : {$like : 'r'}, $page : 5, $itemsPerPage : 7
                  expect(actual).toBe "SELECT * FROM Product WHERE id = 0 AND NAME LIKE 'r' OFFSET 35 LIMIT 7"
                  */
      });
    });
  });
  xdescribe("WebSql provider statements", function() {
    return it("WebSqlProvider data provider", function() {
      var controllerBase, data;
      controllerBase = null;
      data = null;
      runs(function() {
        return require(["Ural/Modules/controllerBase"], function(cb) {
          return controllerBase = cb;
        });
      });
      waits(500);
      return runs(function() {
        var TestController, actual, controller, dataProvider;
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
        dataProvider = controller.getDataProvider();
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getSatement("Product", null);
        expect(dataProvider).toBe("SELECT * FROM Product");
        actual = dataProvider._getSatement("Product", {
          id: {
            $eq: 0
          }
        });
        expect(dataProvider).toBe("SELECT * FROM Product WHERE id = 0");
        actual = dataProvider._getSatement("Product", {
          id: {
            $in: [0, 1, 3]
          },
          $page: 3
        });
        expect(dataProvider).toBe("SELECT * FROM Product WHERE id = 0");
        actual = dataProvider._getSatement("Product", {
          id: {
            $eq: 0
          },
          name: {
            $like: 'r'
          },
          $page: 5,
          $itemsPerPage: 7
        });
        return expect(dataProvider).toBe("SELECT * FROM Product WHERE id = 0");
      });
    });
  });
  xdescribe("load data via controller, by some filters", function() {
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
        var TestController, actual, controller, dataProvider;
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
        dataProvider = controller.getDataProvider();
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getSatement("Product", null);
        expect(dataProvider).toBe("SELECT * FROM Product");
        actual = dataProvider._getSatement("Product", {
          id: {
            $eq: 0
          }
        });
        expect(dataProvider).toBe("SELECT * FROM Product WHERE id = 0");
        actual = dataProvider._getSatement("Product", {
          id: {
            $in: [0, 1, 3]
          },
          $page: 3
        });
        expect(dataProvider).toBe("SELECT * FROM Product WHERE id = 0");
        actual = dataProvider._getSatement("Product", {
          id: {
            $eq: 0
          },
          name: {
            $like: 'r'
          },
          $page: 5,
          $itemsPerPage: 7
        });
        return expect(dataProvider).toBe("SELECT * FROM Product WHERE id = 0");
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
