define ["Models/product", "Models/producer", "Ural/Models/itemVM", "Ural/Modules/PubSub"],
(product, producer, itemVM, pubSub) ->

  class IndexToolbox

    constructor: ->
      @newProduct = ko.observable()
      @newProducer = ko.observable()

    createProduct: (data, event) ->
      event.preventDefault()
      vm = new product.ModelConstructor()
      ivm = new itemVM.ItemVM "Product", vm, product.mappingRules
      ivm.edit =>
        pubSub.pub "model", "end_create", ivm.item
        @newProduct ivm
      @newProduct ivm
      pubSub.pub "model", "create", vm

    createProducer: (data, event) ->
      event.preventDefault()
      vm = new producer.ModelConstructor()
      ivm = new itemVM.ItemVM "Producer", vm, producer.mappingRules
      ivm.edit =>
        pubSub.pub "model", "end_create", ivm.item
        @newProducer ivm
      @newProducer ivm
      pubSub.pub "model", "create", vm

  indexToolbox : new IndexToolbox()
