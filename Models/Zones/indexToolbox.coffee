define ["Models/product", "Ural/Models/itemVM", "Ural/Modules/PubSub"],  (product, itemVM, pubSub) ->

  class IndexToolbox

    constructor: ->
      @newProduct = ko.observable()

    createProduct: (data, event) ->
      event.preventDefault()
      vm = new product.ModelConstructor()
      ivm = new itemVM.ItemVM vm, product.mappingRules
      ivm.edit =>
        pubSub.pub "model", "end_create", ivm.item
        @newProduct ivm
      @newProduct ivm
      pubSub.pub "model", "create", vm

  indexToolbox = new IndexToolbox()

  indexToolbox : indexToolbox
