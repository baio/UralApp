define ["Models/product", "Ural/Models/itemVM"],  (product, itemVM) ->

  class IndexToolbox

    constructor: ->
      @newProduct = ko.observable()

    createProduct: (data, event) ->
      event.preventDefault()
      vm = new product.ModelConstructor()
      ivm = new itemVM.ItemVM vm, product.mappingRules
      ivm.edit ->
        @newProduct null
      @newProduct ivm

  indexToolbox = new IndexToolbox()

  indexToolbox : indexToolbox
