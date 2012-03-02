describe "data test", ->

  describe "convert framework filter to OData filter expression", ->

    filter = null

    beforeEach ->
      runs ->
        require ["Ural/Modules/ODataFilter"], (fr) -> filter = fr
      waits 500

    it "very simple filter: id = 1", ->
      runs ->
        expect(filter).toBeTruthy()
        frameworkFilter =
          id : {$eq : "1"}
        actual = filter.convert frameworkFilter
        expected =
          $filter : "id eq 1"
        expect(actual.$filter).toBe expected.$filter
        expect(actual.$skip).toBe expected.$skip
        expect(actual.$top).toBe expected.$top

    it "filter - id in (...) and name like (...)", ->
      runs ->
        frameworkFilter =
          $page : 1
          $itemsPerPage : 10
          id : {$in : [0,1,5]}
          name : {$like : "o"}
        actual = filter.convert frameworkFilter
        expected =
          $filter : "(id eq 0 or id eq 1 or id eq 5) and indexOf(name, 'o') != -1"
          $skip : 10
          $top : 10
        expect(actual.$filter).toBe expected.$filter
        expect(actual.$skip).toBe expected.$skip
        expect(actual.$top).toBe expected.$top


  describe "convert framework filter to WebSql filter expression", ->

    filter = null

    beforeEach ->
      runs ->
        require ["Ural/Modules/WebSqlFilter"], (fr) -> filter = fr
      waits 500

    it "very simple filter: id = 1", ->
      runs ->
        expect(filter).toBeTruthy()
        frameworkFilter =
          id : {$eq : "1"}
        actual = filter.convert frameworkFilter
        expected =
          $filter : "id = 1"
        expect(actual.$filter).toBe expected.$filter
        expect(actual.$skip).toBe expected.$skip
        expect(actual.$top).toBe expected.$top

    it "filter - id in (...) and name like (...)", ->
      runs ->
        frameworkFilter =
          $page : 1
          $itemsPerPage : 10
          id : {$in : [0,1,5]}
          name : {$like : "o"}
        actual = filter.convert frameworkFilter
        expected =
          $filter : "id IN (0,1,5) AND name LIKE 'o'"
          $skip : 10
          $top : 10
        expect(actual.$filter).toBe expected.$filter
        expect(actual.$skip).toBe expected.$skip
        expect(actual.$top).toBe expected.$top

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
      expect(controller.getDataProvider()).toBeTruthy()
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
