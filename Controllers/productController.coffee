define ["Ural/Controllers/controllerBase"
  , "Ural/Models/indexVM"
  , "Models/product"],
(controllerBase, indexVM, productModel) ->
  class ProductController extends controllerBase.ControllerBase
    constructor: ->
      super "Product"

    indexCustom: (onDone)->
      @getDataProvider().load "Product", null, (err, data) =>
        @view new indexVM.IndexVM(data), "index"
        if onDone then onDone err

    indexCustomWithCustomModel: (onDone)->
      @getDataProvider().load "Product", null, (err, data) =>
        model = data.map (d) -> ko.mapping.fromJS(d, productModel.mappingRules, new productModel.ModelConstructor())
        @view new indexVM.IndexVM(model), "index"
        if onDone then onDone err


  ProductController : ProductController