define ["Ural/Controllers/controllerBase"
  , "Ural/Models/indexVM"
  , "Models/product"
  , "Models/Zones/indexToolbox"
],
(controllerBase, indexVM, productModel, indexToolbox) ->
  class ProductController extends controllerBase.ControllerBase
    constructor: (opts) ->
      super "Product", opts

    indexCustom: (onDone)->
      @getDataProvider().load "Product", $expand : "$index", (err, data) =>
        @view new indexVM.IndexVM(data), "index"
        if onDone then onDone err

    indexCustomWithCustomModel: (onDone)->
      @getDataProvider().load "Product", $expand : "$index", (err, data) =>
        model = data.map (d) -> ko.mapping.fromJS(d, productModel.mappingRules, new productModel.ModelConstructor())
        @view new indexVM.IndexVM(model), "index"
        if onDone then onDone err

    onCreateIndexViewModel: (model, modelModule) ->
      vm = super model, modelModule
      vm.zones.toolbox = indexToolbox.indexToolbox
      vm

  ProductController : ProductController