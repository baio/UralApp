(function() {
  define(["Ural/Modules/WebSqlProvider"], function(webSqlDataProvider) {
    var dataProvider;
    dataProvider = webSqlDataProvider.dataProvider;
    beforeEach(function() {
      var db;
      db = openDatabase('UralApp', '1.0', 'spec database', 2 * 1024 * 1024);
      return db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS Product (id unique, name)");
        tx.executeSql("INSERT INTO Product (id, name) VALUES (0, 'zero')");
        tx.executeSql("INSERT INTO Product (id, name) VALUES (1, 'one')");
        tx.executeSql("INSERT INTO Product (id, name) VALUES (2, 'two')");
        tx.executeSql("INSERT INTO Product (id, name) VALUES (3, 'three')");
        return tx.executeSql("INSERT INTO Product (id, name) VALUES (4, 'four')");
      });
    });
    afterEach(function() {
      var db;
      db = openDatabase('test', '1.0', 'spec database', 2 * 1024 * 1024);
      return db.transaction(function(tx) {
        return tx.executeSql('DROP TABLE IF EXISTS Product');
      });
    });
    describe("WebSql provider statements", function() {
      it("plain without any filter", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", null);
        return expect(actual).toBe("SELECT * FROM Product");
      });
      it("id = 0", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          id: {
            $eq: 0
          }
        });
        return expect(actual).toBe("SELECT * FROM Product WHERE id = 0");
      });
      it("id in (...)", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          id: {
            $in: [0, 1, 3]
          }
        });
        return expect(actual).toBe("SELECT * FROM Product WHERE id IN (0,1,3)");
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
        return expect(actual).toBe("SELECT * FROM Product WHERE id = 0 AND name LIKE '%r%' LIMIT 7 OFFSET 35");
      });
    });
    return describe("load data via WebSql provider", function() {
      var data;
      data = null;
      it("empty filter", function() {
        runs(function() {
          return dataProvider.load("Product", null, function(d) {
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
      it("id = 0", function() {
        runs(function() {
          return dataProvider.load("Product", {
            id: {
              $eq: 0
            }
          }, function(d) {
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
          }, function(d) {
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
          return expect(data[2].name).toBe("free");
        });
      });
      return it("id = 0 and name LIKE(...) OFFSET LIMIT", function() {
        runs(function() {
          return dataProvider.load("Product", {
            id: {
              $eq: 0
            },
            name: {
              $like: 'r'
            }
          }, function(d) {
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
