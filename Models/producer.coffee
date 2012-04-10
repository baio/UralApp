define ["Models/product", "Ural/Models/itemVM"], (product, itemVM) ->

  class Producer
    constructor: ->
      @id = ko.observable()
      @name = ko.observable()
      @Products = ko.observable()

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