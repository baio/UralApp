define ["Controllers/controllerBase"],
(controllerBase) ->
  class ProductController extends controllerBase.ControllerBase

    constructor: (opts) ->
      super "Product", opts

  ProductController : ProductController