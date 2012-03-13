(function() {

  define(["Ural/Modules/ODataProvider"], function(ODataProvider) {
    var dataProvider;
    dataProvider = ODataProvider.dataProvider;
    describe("OData provider statements", function() {
      it("plain without any filter", function() {
        var actual;
        actual = dataProvider._getStatement("Product", null);
        return expect(actual).toBe("http://localhost:3360/Service.svc/Products");
      });
      it("id = 0", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          id: {
            $eq: 0
          }
        });
        return expect(actual).toBe("http://localhost:3360/Service.svc/Products?$filter=id eq 0");
      });
      it("id in (...)", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          id: {
            $in: [0, 1, 3]
          }
        });
        return expect(actual).toBe("http://localhost:3360/Service.svc/Products?$filter=(id eq 0 or id eq 1 or id eq 3)");
      });
      return it("id = 0 and name LIKE(...) OFFSET LIMIT", function() {
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
        return expect(actual).toBe("http://localhost:3360/Service.svc/Products?$filter=id eq 0 and indexof(name, 'r') ne -1&$top=7&$skip=35");
      });
    });
    return describe("load data via OData provider", function() {
      var data;
      data = null;
      it("empty filter", function() {
        runs(function() {
          return dataProvider.load("Product", null, function(err, d) {
            return data = d;
          });
        });
        waits(500);
        return runs(function() {
          expect(data.length).toBe(6);
          expect(data[0].id).toBe(0);
          expect(data[0].name).toBe("zero");
          expect(data[1].id).toBe(1);
          expect(data[1].name).toBe("one");
          expect(data[4].id).toBe(4);
          return expect(data[4].name).toBe("four");
        });
      });
      it("id = 0", function() {
        runs(function() {
          return dataProvider.load("Product", {
            id: {
              $eq: 0
            }
          }, function(err, d) {
            return data = d;
          });
        });
        waits(500);
        return runs(function() {
          expect(data.length).toBe(1);
          expect(data[0].id).toBe(0);
          return expect(data[0].name).toBe("zero");
        });
      });
      it("id in (...)", function() {
        runs(function() {
          return dataProvider.load("Product", {
            id: {
              $in: [0, 1, 3]
            }
          }, function(err, d) {
            return data = d;
          });
        });
        waits(500);
        return runs(function() {
          expect(data.length).toBe(3);
          expect(data[0].id).toBe(0);
          expect(data[0].name).toBe("zero");
          expect(data[1].id).toBe(1);
          expect(data[1].name).toBe("one");
          expect(data[2].id).toBe(3);
          return expect(data[2].name).toBe("three");
        });
      });
      return it("id = 0 and name LIKE(...) skip top", function() {
        runs(function() {
          return dataProvider.load("Product", {
            id: {
              $eq: 0
            },
            name: {
              $like: 'r'
            }
          }, function(err, d) {
            return data = d;
          });
        });
        waits(500);
        return runs(function() {
          expect(data.length).toBe(1);
          expect(data[0].id).toBe(0);
          return expect(data[0].name).toBe("zero");
        });
      });
    });
  });

}).call(this);
