define ["Models/product", "Ural/Models/itemVM", "Ural/Modules/PubSub"],
(product, itemVM, pubSub) ->

  class ItemToolbox

    constructor: ->
      @newProduct = ko.observable()

    addProduct: (data, event) ->
      event.preventDefault()
      vm = new product.ModelConstructor()
      ivm = new itemVM.ItemVM "Product", vm, product.mappingRules
      ivm.edit =>
        pubSub.pub "model", "end_create", ivm.item
        @newProduct ivm
      @newProduct ivm
      pubSub.pub "model", "create", vm

  itemToolbox : new ItemToolbox()