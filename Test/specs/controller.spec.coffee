describe "ControllerBase test", ->
    it "view paths should be baked in the right way", ->
      controllerBase = null
      runs -> require ["Ural/Controllers/controllerBase"], (cb) -> controllerBase = cb
      waits 500
      runs ->
        expect(controllerBase).toBeTruthy()
        class TestController extends controllerBase.ControllerBase
        controller = new TestController()

        path = controller._prepareViewPath null, "Shared/Index"
        expect(path).toBe "Views/Shared/Index.html"
        path = controller._prepareViewPath null, "Views/Shared/Index"
        expect(path).toBe "Views/Shared/Index.html"
        path = controller._prepareViewPath null, "Index"
        expect(path).toBe "Views/Test/Index.html"

    it "load views (without model)", ->
      controllerBase = null
      runs -> require ["Ural/Controllers/controllerBase"], (cb) -> controllerBase = cb
      waits 500
      runs ->
        expect(controllerBase).toBeTruthy()
        class TestController extends controllerBase.ControllerBase
        controller = new TestController()
        controller.view null, "Index",
      waits 500
      runs ->
        expect($("#_body").text().trim()).toEqual "_body"



