(function() {
  describe("framework 2 specific filter convertions", function() {
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
      return it("filter: id in (...) and name like (...)", function() {
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
    return describe("convert framework filter to WebSql filter expression", function() {
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
      return it("filter: id in (...) and name like (...)", function() {
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
  });
}).call(this);
