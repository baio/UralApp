define ["Ural/Controllers/controllerBase"], (controllerBase) ->
  class ProductController extends controllerBase.ControllerBase
    constructor: ->
      super "Product"

    indexCustom: (onDone)->
      @getDataProvider().load "Product", null, (err, data) =>
        @view data, "index"
        if onDone then onDone err


  ProductController : ProductController