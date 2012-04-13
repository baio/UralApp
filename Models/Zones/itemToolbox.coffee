define ["Models/product", "Ural/Models/itemRefVM", "Ural/Modules/PubSub"],
(product, itemRefVM, pubSub) ->

  class ItemToolbox

    constructor: ->
      @newProduct = ko.observable()

    addProduct: (data, event, indexRefVM) ->
      event.preventDefault()
      vm = new product.ModelConstructor()
      ivm = new itemRefVM.ItemRefVM indexRefVM, "Product", vm, product.mappingRules
      ivm.edit =>
        pubSub.pub "model", "end_create", ivm.item
        @newProduct ivm
      @newProduct ivm
      pubSub.pub "model", "create", vm

  itemToolbox : new ItemToolbox()