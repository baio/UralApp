define ["Ural/Modules/pubSub", "Ural/Models/itemVM"], (pubSub, itemVM) ->

  class IndexVM
    constructor: (model) ->
      @list = model.map (m) -> new itemVM.ItemVM m
      @active = ko.observable()

    _clone: (item) ->
      $.extend true, {}, item

    edit: (item, event) =>
      event.preventDefault()
      cloned = @_clone item
      @active cloned
      pubSub.pub "model", "edit", cloned

    details: (id) ->

  IndexVM : IndexVM