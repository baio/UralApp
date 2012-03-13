define ["Ural/Modules/WebSqlProvider"], (webSqlDataProvider) ->

    dataProvider = webSqlDataProvider.dataProvider
    
    beforeEach ->
      #prepare data

      db = openDatabase 'UralApp', '1.0', 'spec database', 2 * 1024 * 1024
      db.transaction (tx) ->
        tx.executeSql "CREATE TABLE IF NOT EXISTS Product (id unique, name)"
        tx.executeSql "INSERT INTO Product (id, name) VALUES (0, 'zero')"
        tx.executeSql "INSERT INTO Product (id, name) VALUES (1, 'one')"
        tx.executeSql "INSERT INTO Product (id, name) VALUES (2, 'two')"
        tx.executeSql "INSERT INTO Product (id, name) VALUES (3, 'three')"
        tx.executeSql "INSERT INTO Product (id, name) VALUES (4, 'four')"


    afterEach ->
      #destroy data

      db = openDatabase 'test', '1.0', 'spec database', 2 * 1024 * 1024
      db.transaction (tx) ->
        tx.executeSql('DROP TABLE IF EXISTS Product');

    describe "WebSql provider statements", ->
      it "plain without any filter", ->

          expect(dataProvider).toBeTruthy()
          actual = dataProvider._getStatement "Product", null
          expect(actual).toBe "SELECT * FROM Product"

      it "id = 0", ->

          expect(dataProvider).toBeTruthy()
          actual = dataProvider._getStatement "Product", id : {$eq : 0 }
          expect(actual).toBe "SELECT * FROM Product WHERE id = 0"

      it "id in (...)", ->

          expect(dataProvider).toBeTruthy()
          actual = dataProvider._getStatement "Product", id : {$in : [0,1,3] }
          expect(actual).toBe "SELECT * FROM Product WHERE id IN (0,1,3)"

      it "id = 0 and name LIKE(...) OFFSET LIMIT", ->

          expect(dataProvider).toBeTruthy()
          actual = dataProvider._getStatement "Product", id : { $eq : 0}, name : {$like : 'r'}, $page : 5, $itemsPerPage : 7
          expect(actual).toBe "SELECT * FROM Product WHERE id = 0 AND name LIKE '%r%' LIMIT 7 OFFSET 35"


    describe "load data via WebSql provider", ->
      data = null
      it "empty filter", ->
          runs ->
            dataProvider.load "Product", null, (err, d) -> data = d
          waits 500
          runs ->
            expect(data.length).toBe 5
            expect(data[0].id).toBe 0
            expect(data[0].name).toBe "zero"
            expect(data[1].id).toBe 1
            expect(data[1].name).toBe "one"
            expect(data[4].id).toBe 4
            expect(data[4].name).toBe "four"
      it "id = 0", ->
            runs ->
              dataProvider.load "Product", id : {$eq : 0}, (err, d) -> data = d
            waits 500
            runs ->
              expect(data.length).toBe 1
              expect(data[0].id).toBe 0
              expect(data[0].name).toBe "zero"
      it "id in (...)", ->
            runs ->
              dataProvider.load "Product", id : {$in : [0,1,3] }, (err, d) -> data = d
            waits 500
            runs ->
              expect(data.length).toBe 3
              expect(data[0].id).toBe 0
              expect(data[0].name).toBe "zero"
              expect(data[1].id).toBe 1
              expect(data[1].name).toBe "one"
              expect(data[2].id).toBe 3
              expect(data[2].name).toBe "three"
      it "id = 0 and name LIKE(...) OFFSET LIMIT", ->
            runs ->
              dataProvider.load "Product", id : { $eq : 0}, name : {$like : 'r'}, (err, d) -> data = d
            waits 500
            runs ->
              expect(data.length).toBe 1
              expect(data[0].id).toBe 0
              expect(data[0].name).toBe "zero"

            