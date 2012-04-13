define ["Models/product", "Models/producer", "Ural/Models/itemVM", "Ural/Modules/PubSub"],
(product, producer, itemVM, pubSub) ->

  class IndexToolbox

    constructor: ->
      @newProduct = ko.observable()
      @newProducer = ko.observable()

    _create: (data, event, typeName, prop) ->
      event.preventDefault()
      ivm = new itemVM.ItemVM typeName
      ivm.map null, true, (err) =>
        if !err
          ivm.edit =>
            ivm.endEdit()
            pubSub.pub "model", "end_create", ivm.item
            prop ivm
          prop ivm
          pubSub.pub "model", "create", ivm.item

    createProduct: (data, event) ->
      @_create data, event, "Product", @newProduct

    createProducer: (data, event) ->
      @_create data, event, "Producer", @newProducer

  indexToolbox : new IndexToolbox()
