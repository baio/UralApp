define ["Controllers/productController", "Ural/Controllers/controllerBase", "setup"], (productController, controllerBase) ->

  xdescribe "play with index views, load model then show view", ->

    afterEach ->
      $("#_body").empty()

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
        expect($("table#model_container td:eq(2) span:eq(0)").text()).toBe("Sport")
        expect($("table#model_container td:eq(2) span:eq(1)").text()).toBe("Hobby")
        expect($("table#model_container td:eq(3)").text()).toBe("1")
        expect($("table#model_container td:eq(4)").text()).toBe("one")

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
        expect($("table#model_container td:eq(2) span:eq(0)").text()).toBe("Sport")
        expect($("table#model_container td:eq(2) span:eq(1)").text()).toBe("Sport short")
        expect($("table#model_container td:eq(2) span:eq(2)").text()).toBe("Hobby")
        expect($("table#model_container td:eq(2) span:eq(3)").text()).toBe("Hobby short")
        expect($("table#model_container td:eq(3)").text()).toBe("0 zerofoo")
        expect($("table#model_container td:eq(20)").text()).toBe("5")
        expect($("table#model_container td:eq(21)").text()).toBe("fivefoo")
        expect($("table#model_container td:eq(23)").text()).toBe("5 fivefoo")
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
        expect($("table#model_container td:eq(3)").text()).toBe("0 zerofoo")
        expect($("table#model_container td:eq(4)").text()).toBe("1")
        expect($("table#model_container td:eq(15)").text()).toBe("3 threefoo")
        expect($("table#model_container td:eq(16)").text()).toBe("4")

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
        expect($("table#model_container td:eq(3)").text()).toBe("0 zerofoo")
        expect($("table#model_container td:eq(4)").text()).toBe("1")
        expect($("table#model_container td:eq(15)").text()).toBe("3 threefoo")
        expect($("table#model_container td:eq(16)").text()).toBe("4")

    it "model name impilcitily, create custom model (path to module implicitily) via options", ->
      controller = new productController.ProductController model : {useCustomModel : true}
      err = null
      runs ->
        controller.index null, (e) ->
          err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect($("table#model_container td:eq(0)").text()).toBe("0")
        expect($("table#model_container td:eq(1)").text()).toBe("zerofoo")
        expect($("table#model_container td:eq(2) span:eq(0)").text()).toBe("Sport")
        expect($("table#model_container td:eq(2) span:eq(1)").text()).toBe("Sport short")
        expect($("table#model_container td:eq(2) span:eq(2)").text()).toBe("Hobby")
        expect($("table#model_container td:eq(2) span:eq(3)").text()).toBe("Hobby short")
        expect($("table#model_container td:eq(3)").text()).toBe("0 zerofoo")
        expect($("table#model_container td:eq(20)").text()).toBe("5")
        expect($("table#model_container td:eq(21)").text()).toBe("fivefoo")
        expect($("table#model_container td:eq(23)").text()).toBe("5 fivefoo")


  xdescribe "edit index view's items", ->
    viewModel = null
    beforeEach ->
      controller = new productController.ProductController model : {useCustomModel : true}
      runs ->
        controller.index null, (err, vm) -> viewModel = vm
      waits 500
      runs ->
        $("table#model_container tr:eq(0)").click()

    afterEach ->
      #viewModel = null
      #$("#_body").empty()

    it "show edit for first item", ->
      expect($("[data-form-model-type='Product'][data-form-type='edit']").is(":visible")).toBe(true)
      expect($("#product_name").val()).toBe('zerofoo')

    it "show edit for first item, then edit name, then cancel", ->
      expect(viewModel.active().item.name()).toBe "zerofoo"
      $("#product_name").val("test").change()
      expect(viewModel.list[0].item.name()).toBe "test"
      expect(viewModel.active().item.name()).toBe "test"
      $("#product_cancel").click()
      expect(viewModel.list[0].item.name()).toBe "zerofoo"
      expect(viewModel.active()).toBe null

    it "show edit for first item, then edit name, then submit", ->
      expect(viewModel.active().item.name()).toBe "zerofoo"
      $("#product_name").val("-nill-").change()
      expect(viewModel.list[0].item.name()).toBe "-nill-"
      expect(viewModel.active().item.name()).toBe "-nill-"
      $("#product_save").click()
      expect(viewModel.list[0].item.name()).toBe "-nill-"
      $("#product_name").val("zero").change()
      $("#product_save").click()
      expect(viewModel.list[0].item.name()).toBe "zero"


  xdescribe "Tags", ->
    viewModel = null
    beforeEach ->
      controller = new productController.ProductController model : {useCustomModel : true}
      runs ->
        controller.index null, (err, vm) -> viewModel = vm
      waits 500
      runs ->
        $("table#model_container tr:eq(0)").click()


    it "check tags on the view", ->
      expect($("[data-form-model-type='Product'][data-form-type='edit']").is(":visible")).toBe(true)
      expect($(".tagit .tagit-label:eq(0)").text()).toBe('Sport')
      expect($(".tagit .tagit-label:eq(1)").text()).toBe('Hobby')

  describe "Autocomplete", ->
    viewModel = null
    beforeEach ->
      controller = new productController.ProductController model : {useCustomModel : true}
      runs ->
        controller.index null, (err, vm) -> viewModel = vm
      waits 500
      runs ->
        $("table#model_container tr:eq(0)").click()

    it "check autocomplete value", ->




