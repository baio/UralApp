define ["Ural/Controllers/controllerBase"], (controllerBase) ->
  class ProductController extends controllerBase.ControllerBase

    index: ->
      @view null, "index"

  ProductController : ProductController