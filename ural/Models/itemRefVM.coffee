define ["Ural/Models/itemVM"], (itemVM) ->

  class ItemRefVM extends itemVM.ItemVM

    constructor: (@indexRefVM, typeName) ->
      super typeName

    _getMode: -> "updateParent"

    update: (onDone) ->
      super (err) =>
        onDone err
        if @_getMode() == "updateParent"
          if !err
            @indexRefVM.parentItemVM.update ->

    remove: (onDone) ->
      super (err) =>
        if onDone then onDone err
        if @_getMode() == "updateParent"
          if !err
            @indexRefVM.parentItemVM.update ->

    onUpdate: (state, onDone) ->
      onDone null, @item

    onRemove: (onDone) ->
      onDone null, @item

  ItemRefVM : ItemRefVM