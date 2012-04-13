define ["Models/product", "Ural/Models/itemRefVM", "Ural/Modules/PubSub"],
(product, itemRefVM, pubSub) ->

  class ItemToolbox

    constructor: ->
      @newProduct = ko.observable()

    _add: (data, event, indexRefVM, typeName, prop) ->
      event.preventDefault()
      ivm = new itemRefVM.ItemRefVM indexRefVM, typeName
      ivm.map null, true, (err) =>
        if !err
          ivm.edit =>
            pubSub.pub "model", "end_create", ivm.item
            prop ivm
          prop ivm
          pubSub.pub "model", "create", ivm.item

    addProduct: (data, event, indexRefVM) ->
      @_add data, event, indexRefVM, "Product", @newProduct

  itemToolbox : new ItemToolbox()