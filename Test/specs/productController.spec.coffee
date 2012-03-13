define ["Controllers/productController", "Ural/Controllers/controllerBase"], (productController, controllerBase) ->


  describe "play with index views", ->

    it "indexCustom, load model then show view", ->
      controller = new productController.ProductController()
      err = null
      runs ->
        controller.indexCustom (e) ->
          err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect($("table#model_container td:eq(0)").text()).toBe("0")
        expect($("table#model_container td:eq(1)").text()).toBe("zero")
        expect($("table#model_container td:eq(10)").text()).toBe("5")
        expect($("table#model_container td:eq(11)").text()).toBe("five")

    it "index, ini model name explicitly via constructor, load model then show view", ->
      controller = new productController.ProductController()
      err = null
      runs ->
        controller.index (e) ->
          err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect($("table#model_container td:eq(2)").text()).toBe("1")
        expect($("table#model_container td:eq(3)").text()).toBe("one")
        expect($("table#model_container td:eq(10)").text()).toBe("5")
        expect($("table#model_container td:eq(11)").text()).toBe("five")

    it "index, ini model name implicitly via class name, load model then show view", ->
      class ProductController extends controllerBase.ControllerBase
      controller = new ProductController()
      err = null
      runs ->
        controller.index (e) ->
          err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect($("table#model_container td:eq(2)").text()).toBe("1")
        expect($("table#model_container td:eq(3)").text()).toBe("one")
        expect($("table#model_container td:eq(10)").text()).toBe("5")
        expect($("table#model_container td:eq(11)").text()).toBe("five")


