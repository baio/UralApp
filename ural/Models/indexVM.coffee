define ["Ural/Modules/pubSub", "Ural/Models/itemVM"], (pubSub, itemVM) ->

  class IndexVM
    constructor: (model) ->
      @list = model.map (m) -> new itemVM.ItemVM m
      @active = ko.observable()

    edit: (item, event) =>
      event.preventDefault()
      @active item
      item.edit =>
        item.endEdit()
        @active null
      pubSub.pub "model", "edit", item

    details: (id) ->

  IndexVM : IndexVM