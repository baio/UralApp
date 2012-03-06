beforeEach ->
  #prepare data
  ###
  db = openDatabase 'test', '1.0', 'spec database', 2 * 1024 * 1024
  db.transaction (tx) ->
    tx.executeSql "CREATE TABLE IF NOT EXISTS Product (id unique, name)"
    tx.executeSql "INSERT INTO Product (id, name) VALUES (0, 'zero')"
    tx.executeSql "INSERT INTO Product (id, name) VALUES (1, 'one')"
    tx.executeSql "INSERT INTO Product (id, name) VALUES (2, 'two')"
    tx.executeSql "INSERT INTO Product (id, name) VALUES (3, 'free')"
    tx.executeSql "INSERT INTO Product (id, name) VALUES (4, 'four')"
  ###

afterEach ->
  #destroy data
  ###
  db = openDatabase 'test', '1.0', 'spec database', 2 * 1024 * 1024
  db.transaction (tx) ->
    tx.executeSql('DROP TABLE IF EXISTS Product');
  ###

describe "WebSql provider statements", ->
      dataProvider = null
      beforeEach ->
          runs ->
            require ["Ural/Modules/WebSqlProvider"] , (dp) -> dataProvider = dp.dataProvider
          waits 500

      it "plain without any filter", ->
        runs ->
          expect(dataProvider).toBeTruthy()
          actual = dataProvider._getStatement "Product", null
          expect(actual).toBe "SELECT * FROM Product"

      it "id = 0", ->
        runs ->
          expect(dataProvider).toBeTruthy()
          actual = dataProvider._getStatement "Product", id : {$eq : 0 }
          expect(actual).toBe "SELECT * FROM Product WHERE id = 0"

      it "id in (...)", ->
        runs ->
          expect(dataProvider).toBeTruthy()
          actual = dataProvider._getStatement "Product", id : {$in : [0,1,3] }
          expect(actual).toBe "SELECT * FROM Product WHERE id IN (0,1,3)"

      it "id = 0 and name LIKE(...) OFFSET LIMIT", ->
        runs ->
          expect(dataProvider).toBeTruthy()
          actual = dataProvider._getStatement "Product", id : { $eq : 0}, name : {$like : 'r'}, $page : 5, $itemsPerPage : 7
          expect(actual).toBe "SELECT * FROM Product WHERE id = 0 AND name LIKE 'r' LIMIT 7 OFFSET 35"

          ###
          actual = dataProvider._getSatement "Product", id : {$eq : 0 }
          expect(actual).toBe "SELECT * FROM Product WHERE id = 0"
          actual = dataProvider._getSatement "Product", id : {$in : [0,1,3] }, $page : 3
          expect(actual).toBe "SELECT * FROM Product WHERE id IN (0,1,3)"
          actual = dataProvider._getSatement "Product", id : { $eq : 0}, name : {$like : 'r'}, $page : 5, $itemsPerPage : 7
          expect(actual).toBe "SELECT * FROM Product WHERE id = 0 AND NAME LIKE 'r' OFFSET 35 LIMIT 7"
          ###

xdescribe "WebSql provider statements", ->

  it "WebSqlProvider data provider", ->
    controllerBase = null
    data = null
    runs -> require ["Ural/Modules/controllerBase"], (cb) -> controllerBase = cb
    waits 500
    runs ->
      expect(controllerBase).toBeTruthy()
      class TestController extends controllerBase.ControllerBase
      controller = new TestController()
      expect(controller.defaultDataProviderName).toBe "odata"
      expect(controller.getDataProvider()).toBeTruthy()
      controller.defaultDataProviderName = "websql"
      dataProvider = controller.getDataProvider()
      expect(dataProvider).toBeTruthy()
      actual = dataProvider._getSatement "Product", null
      expect(dataProvider).toBe "SELECT * FROM Product"
      actual = dataProvider._getSatement "Product", id : {$eq : 0 }
      expect(dataProvider).toBe "SELECT * FROM Product WHERE id = 0"
      actual = dataProvider._getSatement "Product", id : {$in : [0,1,3] }, $page : 3
      expect(dataProvider).toBe "SELECT * FROM Product WHERE id = 0"
      actual = dataProvider._getSatement "Product", id : { $eq : 0}, name : {$like : 'r'}, $page : 5, $itemsPerPage : 7
      expect(dataProvider).toBe "SELECT * FROM Product WHERE id = 0"

xdescribe "load data via controller, by some filters", ->

  it "load data via WebSqlProvider data provider", ->
    controllerBase = null
    data = null
    runs -> require ["Ural/Controllers/controllerBase"], (cb) -> controllerBase = cb
    waits 500
    runs ->
      expect(controllerBase).toBeTruthy()
      class TestController extends controllerBase.ControllerBase
      controller = new TestController()
      expect(controller.defaultDataProviderName).toBe "odata"
      expect(controller.getDataProvider()).toBeTruthy()
      controller.defaultDataProviderName = "websql"
      dataProvider = controller.getDataProvider()
      expect(dataProvider).toBeTruthy()
      actual = dataProvider._getSatement "Product", null
      expect(dataProvider).toBe "SELECT * FROM Product"
      actual = dataProvider._getSatement "Product", id : {$eq : 0 }
      expect(dataProvider).toBe "SELECT * FROM Product WHERE id = 0"
      actual = dataProvider._getSatement "Product", id : {$in : [0,1,3] }, $page : 3
      expect(dataProvider).toBe "SELECT * FROM Product WHERE id = 0"
      actual = dataProvider._getSatement "Product", id : { $eq : 0}, name : {$like : 'r'}, $page : 5, $itemsPerPage : 7
      expect(dataProvider).toBe "SELECT * FROM Product WHERE id = 0"

      #dataProvider.load null, (d) -> data = d
    ###
    waits 500
    runs ->
      expect(data.length).toBe 5
      expect(data[0].id).toBe 0
      expect(data[0].name).toBe "zero"
      expect(data[1].id).toBe 1
      expect(data[1].name).toBe "one"
      expect(data[4].id).toBe 4
      expect(data[4].name).toBe "four"
    ###


  xit "load data (using controller) via default (OData) data provider", ->
      controllerBase = null
      data = null
      runs -> require ["Ural/Controllers/controllerBase"], (cb) -> controllerBase = cb
      waits 500
      runs ->
        expect(controllerBase).toBeDefined()
        class TestController extends controllerBase.ControllerBase
        controller = new TestController()
        dataProvider = controller.dataProvider
        expect(dataProvider).toBeDefined()
        dataProvider.load null, (d) -> data = d
      waits 500
      runs ->
        expect(data.length).toBe 5
        expect(data[0].id).toBe 0
        expect(data[0].name).toBe "zero"
        expect(data[1].id).toBe 1
        expect(data[1].name).toBe "one"
        expect(data[4].id).toBe 4
        expect(data[4].name).toBe "four"
