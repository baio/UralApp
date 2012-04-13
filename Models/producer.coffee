define ["Models/product", "Ural/Models/indexRefVM"], (product, indexRefVM) ->

  class Producer
    constructor: ->
      @id = ko.observable()
      @name = ko.observable()
      @Products = ko.observableArray()

      ko.mapping.fromJS __metadata.def, __metadata.mapping, @

  __metadata =
    mapping :
      name :
        update: (opts) -> opts.data
      Products :
        update: (opts) -> ko.mapping.fromJS opts.data, product.mappingRules, new product.ModelConstructor()
    def :
        id : -1
        name : null
        Products : []
    viewModels : [
          {
            name : "ProductsVM"
            typeName : "Product"
            field : "Products"
            mapping : product.mappingRules
          }
        ]

  ModelConstructor : Producer
  metadata : __metadata