define ["Controllers/productController", "Ural/Controllers/controllerBase"], (productController, controllerBase) ->


  describe "play with index views, load model then show view", ->

    afterEach ->
      #$("#_body").empty()

    it "indexCustom", ->
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

    it "indexCustom with custom model", ->
      controller = new productController.ProductController()
      err = null
      runs ->
        controller.indexCustomWithCustomModel (e) ->
          err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect($("table#model_container td:eq(0)").text()).toBe("0")
        expect($("table#model_container td:eq(1)").text()).toBe("zerofoo")
        expect($("table#model_container td:eq(2)").text()).toBe("0 zerofoo")
        expect($("table#model_container td:eq(15)").text()).toBe("5")
        expect($("table#model_container td:eq(16)").text()).toBe("fivefoo")
        expect($("table#model_container td:eq(17)").text()).toBe("5 fivefoo")
        #expect($("table#model_container td:eq(14)").text()).toBe("5 fivefoo")

    it "index, ini model name explicitly via constructor", ->
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

    it "index, ini model name implicitly via class name", ->
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

    it "model name impilcitily, create custom model (path to module implicitily) via options", ->
      controller = new productController.ProductController model : {useCustomModel : true}
      err = null
      runs ->
        controller.index (e) ->
          err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect($("table#model_container td:eq(0)").text()).toBe("0")
        expect($("table#model_container td:eq(1)").text()).toBe("zerofoo")
        expect($("table#model_container td:eq(2)").text()).toBe("0 zerofoo")
        expect($("table#model_container td:eq(15)").text()).toBe("5")
        expect($("table#model_container td:eq(16)").text()).toBe("fivefoo")
        expect($("table#model_container td:eq(17)").text()).toBe("5 fivefoo")
  #expect($("table#model_container td:eq(14)").text()).toBe("5 fivefoo")

  describe "edit index view's items", ->
    viewModel = null
    beforeEach ->
      controller = new productController.ProductController model : {useCustomModel : true}
      runs ->
        controller.index null, (err, vm) -> viewModel = vm
      waits 500
      runs ->
        $("table#model_container tr:eq(0)").click()

    afterEach ->
      viewModel = null
      $("#_body").empty()

    it "show edit for first item", ->
      expect($("[data-form-model-type='Product'][data-form-type='edit']").is(":visible")).toBe(true)
      expect($("#product_name").val()).toBe('zerofoo')

    it "show edit for first item, then edit name, then cancel", ->
      expect(viewModel.active().item.name()).toBe "zerofoo"
      $("#product_name").val("test").change()
      #viewModel.active().item.name "test"
      expect(viewModel.list[0].item.name()).toBe "test"
      expect(viewModel.active().item.name()).toBe "test"
      $("#product_cancel").click()
      expect(viewModel.list[0].item.name()).toBe "zerofoo"
      expect(viewModel.active()).toBe null

    it "show edit for first item, then edit name, then submit", ->
      expect(viewModel.active().item.name()).toBe "zerofoo"
      $("#product_name").val("null").change()
      expect(viewModel.list[0].item.name()).toBe "null"
      expect(viewModel.active().item.name()).toBe "null"
      $("#product_save").click()
      expect(viewModel.list[0].item.name()).toBe "null"
      expect(viewModel.active()).toBe null




