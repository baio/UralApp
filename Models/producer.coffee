define ["Models/product", "Ural/Models/IndexRefVM"], (product, indexRefVM) ->

  class Producer
    constructor: ->
      @id = ko.observable()
      @name = ko.observable()
      @Products = ko.observableArray()
      @ProductsVM = new indexRefVM.IndexRefVM "Product", @Products, product.mappingRules

      ko.mapping.fromJS def(), mappingRules(), @

  mappingRules = ->
    name :
      update: (opts) -> opts.data
    Products :
      update: (opts) -> ko.mapping.fromJS opts.data, product.mappingRules, new product.ModelConstructor()

  def = ->
    id : -1
    name : null
    Products : []

  ModelConstructor : Producer
  mappingRules : mappingRules()