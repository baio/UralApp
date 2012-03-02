describe "load data via controller, by some filters", ->

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
